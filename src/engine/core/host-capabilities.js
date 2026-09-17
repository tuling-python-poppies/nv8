/**
 * Host Capabilities
 *
 * 探测宿主 Node/V8 提供的能力，输出三态结果：
 *
 * - `available`：能力存在且冒烟测试通过
 * - `broken`：能力存在但行为不符合预期（比 unavailable 更危险，必须区分）
 * - `unavailable`：能力不存在
 *
 * 为什么要区分 `broken`：某些 Node 版本上 API 存在但语义有差异，
 * 若只报布尔值，调用方会误以为可用而在运行期才炸。`broken` 让 Profile
 * 可以在 plan 阶段就拒绝，并给出可行动的 reason。
 */

import vm from 'node:vm';
import { Worker } from 'node:worker_threads';

/** 能力状态 */
export const CAPABILITY_STATUS = Object.freeze({
  AVAILABLE: 'available',
  BROKEN: 'broken',
  UNAVAILABLE: 'unavailable',
});

/**
 * Node 版本支持矩阵。
 *
 * `tier` 语义：
 * - `supported`：CI 覆盖，问题按 bug 处理
 * - `best-effort`：可运行但未全量验证，问题按兼容性改进处理
 * - `unsupported`：已知缺关键能力，启动即拒绝
 */
export const NODE_SUPPORT_MATRIX = Object.freeze([
  Object.freeze({ range: [24, 0], tier: 'supported', notes: 'primary target' }),
  Object.freeze({ range: [22, 0], tier: 'supported', notes: 'LTS' }),
  Object.freeze({ range: [20, 0], tier: 'supported', notes: 'LTS; ArrayBuffer.transfer falls back to a copy; Window global enumeration order cannot match real Edge (V8 < 12 sorts enumerable keys first)' }),
  Object.freeze({ range: [18, 18], tier: 'supported', notes: 'minimum; Iterator helpers and ArrayBuffer.transfer are absent; Window global enumeration order cannot match real Edge (V8 < 12 sorts enumerable keys first)' }),
]);

/** Core 声明的最低 Node 版本 */
export const MINIMUM_NODE_VERSION = Object.freeze({ major: 18, minor: 18 });

function parseNodeVersion(version = process.versions.node) {
  const match = /^(\d+)\.(\d+)\.(\d+)/.exec(version);
  if (!match) return null;
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    raw: version,
  };
}

/**
 * 判定当前（或指定）Node 版本的支持等级。
 *
 * @param {string} [version]
 * @returns {{ version: object|null, tier: string, notes: string|null, meetsMinimum: boolean }}
 */
export function resolveNodeSupport(version = process.versions.node) {
  const parsed = parseNodeVersion(version);
  if (parsed === null) {
    return { version: null, tier: 'unsupported', notes: 'unparseable version', meetsMinimum: false };
  }

  const meetsMinimum = parsed.major > MINIMUM_NODE_VERSION.major
    || (parsed.major === MINIMUM_NODE_VERSION.major
      && parsed.minor >= MINIMUM_NODE_VERSION.minor);

  for (const entry of NODE_SUPPORT_MATRIX) {
    const [major, minor] = entry.range;
    if (parsed.major > major || (parsed.major === major && parsed.minor >= minor)) {
      return { version: parsed, tier: entry.tier, notes: entry.notes, meetsMinimum };
    }
  }

  return { version: parsed, tier: 'unsupported', notes: 'below minimum supported version', meetsMinimum };
}

/**
 * 单个能力探针。
 *
 * probe 返回值语义：
 * - `true` / undefined → available
 * - `false` → unavailable
 * - `{ status, reason }` → 显式三态
 * - 抛错 → broken（存在但不可用），并记录 reason
 */
function probeCapability(id, probe) {
  let outcome;
  try {
    outcome = probe();
  } catch (error) {
    return {
      id,
      status: CAPABILITY_STATUS.BROKEN,
      reason: `probe threw: ${error.message}`,
    };
  }

  if (outcome === false || outcome === null || outcome === undefined) {
    return { id, status: CAPABILITY_STATUS.UNAVAILABLE, reason: 'not present in this runtime' };
  }

  if (outcome === true) {
    return { id, status: CAPABILITY_STATUS.AVAILABLE, reason: null };
  }

  if (typeof outcome === 'object' && typeof outcome.status === 'string') {
    return { id, status: outcome.status, reason: outcome.reason ?? null };
  }

  return { id, status: CAPABILITY_STATUS.AVAILABLE, reason: null };
}

/**
 * 能力探针定义。
 *
 * 每个探针都做真实冒烟测试，而不是只查 typeof——存在但行为不对的 API
 * 必须被识别为 broken。
 */
const CAPABILITY_PROBES = Object.freeze({
  'vm.context': () => {
    const context = vm.createContext({ probe: 1 });
    const value = vm.runInContext('probe + 1', context);
    return value === 2
      ? true
      : { status: CAPABILITY_STATUS.BROKEN, reason: `unexpected eval result: ${value}` };
  },

  'vm.source-text-module': () => {
    if (typeof vm.SourceTextModule !== 'function') return false;
    // 构造成功即算可用；link/evaluate 是异步的，不在同步探针里做
    try {
      new vm.SourceTextModule('export default 1;');
      return true;
    } catch (error) {
      // 未开 --experimental-vm-modules 时会抛错：能力存在但不可用
      return {
        status: CAPABILITY_STATUS.BROKEN,
        reason: `construction failed (${error.message}); run node with --experimental-vm-modules`,
      };
    }
  },

  'worker.thread': () => typeof Worker === 'function',

  'structured.clone': () => {
    if (typeof structuredClone !== 'function') return false;
    const clone = structuredClone({ nested: [1, 2] });
    return clone.nested[1] === 2
      ? true
      : { status: CAPABILITY_STATUS.BROKEN, reason: 'clone did not preserve structure' };
  },

  'array-buffer.transfer': () => {
    if (typeof ArrayBuffer.prototype.transfer !== 'function') return false;
    const buffer = new ArrayBuffer(8);
    const moved = buffer.transfer();
    return buffer.detached === true && moved.byteLength === 8
      ? true
      : { status: CAPABILITY_STATUS.BROKEN, reason: 'transfer did not detach the source buffer' };
  },

  'symbol.async-dispose': () => typeof Symbol.asyncDispose === 'symbol',

  'weak-ref': () => typeof WeakRef === 'function' && typeof FinalizationRegistry === 'function',

  'abort-signal.timeout': () => typeof AbortSignal?.timeout === 'function',

  'vm.global-property-order': () => {
    // `Object.getOwnPropertyNames(window)` 的**顺序**是指纹的一维，NV8 靠
    // 「捕获 → 全部删除 → 按目标序重定义」复现它（`finalize-window-surface-order.js`）。
    // 这要求 global 的字符串键按插入序枚举，也就是 [[OwnPropertyKeys]] 的规范要求。
    //
    // V8 10.x / 11.x（Node 18 / 20）在 dictionary 模式的 global object 上
    // **把可枚举键排在不可枚举键之前**，不按插入序。V8 12.x（Node 22）已修正。
    //
    // 这不是能绕过去的：`enumerable` 本身是要复现的契约值，不能为了顺序而改。
    // 实测后果是 Node 18/20 上 238 个全局排到 V8 内建之前，`window` 落在索引 0
    // 而真实 Edge 是 678。形状层完全看不到——名字、descriptor、原型成员全都对。
    //
    // 报 `broken` 而不是 `unavailable`：能力存在（属性能定义、能删），只是行为
    // 不符合规范，而这正是 `broken` 与 `unavailable` 要区分开的场景。
    const context = vm.createContext({});
    const verdict = vm.runInContext(`(() => {
      Object.defineProperty(globalThis, '__nv8hidden', {
        value: 1, writable: true, enumerable: false, configurable: true });
      Object.defineProperty(globalThis, '__nv8shown', {
        value: 1, writable: true, enumerable: true, configurable: true });
      const names = Object.getOwnPropertyNames(globalThis);
      const hidden = names.indexOf('__nv8hidden');
      const shown = names.indexOf('__nv8shown');
      const builtin = names.indexOf('Object');
      return (hidden > builtin && shown > hidden)
        ? 'insertion-order'
        : 'enumerable-first (hidden=' + hidden + ' shown=' + shown
          + ' Object=' + builtin + ')';
    })()`, context);
    return verdict === 'insertion-order'
      ? true
      : {
        status: CAPABILITY_STATUS.BROKEN,
        reason: `global keys are not in insertion order: ${verdict}. `
          + 'The Window global enumeration order cannot match real Edge on this '
          + 'runtime; use Node 22+ for fingerprint-sensitive work.',
      };
  },
});

/**
 * 探测宿主能力。
 *
 * @returns {Readonly<object>}
 */
export function detectHostCapabilities() {
  const capabilities = {};
  for (const [id, probe] of Object.entries(CAPABILITY_PROBES)) {
    capabilities[id] = Object.freeze(probeCapability(id, probe));
  }

  const support = resolveNodeSupport();

  // `features` 保留布尔视图以兼容既有调用方和 lock plan 摘要
  const features = {};
  for (const [id, record] of Object.entries(capabilities)) {
    features[id] = record.status === CAPABILITY_STATUS.AVAILABLE;
  }

  return Object.freeze({
    nodeVersion: process.versions.node,
    v8Version: process.versions.v8,
    nodeSupportTier: support.tier,
    meetsMinimumNode: support.meetsMinimum,
    capabilities: Object.freeze(capabilities),
    features: Object.freeze(features),
  });
}

/**
 * 能力是否可用（严格：broken 不算可用）
 * @param {object} hostCapabilities
 * @param {string} featureId
 * @returns {boolean}
 */
export function hostSupports(hostCapabilities, featureId) {
  const record = hostCapabilities?.capabilities?.[featureId];
  if (record) return record.status === CAPABILITY_STATUS.AVAILABLE;
  // 兼容只有布尔视图的旧快照
  return hostCapabilities?.features?.[featureId] === true;
}

/**
 * 读取能力状态三态
 * @param {object} hostCapabilities
 * @param {string} featureId
 * @returns {{ status: string, reason: string|null }}
 */
export function hostCapabilityStatus(hostCapabilities, featureId) {
  const record = hostCapabilities?.capabilities?.[featureId];
  if (record) return { status: record.status, reason: record.reason };
  if (hostCapabilities?.features?.[featureId] === true) {
    return { status: CAPABILITY_STATUS.AVAILABLE, reason: null };
  }
  return { status: CAPABILITY_STATUS.UNAVAILABLE, reason: 'unknown capability' };
}

/**
 * 启动前置检查。
 *
 * 在 Node 版本低于最低要求时立刻失败，而不是等到运行期某个能力缺失。
 * `best-effort` 等级只发警告，不阻止启动。
 *
 * @param {object} [options]
 * @param {object} [options.capabilities] 复用已探测结果
 * @param {(message: string) => void} [options.warn]
 * @returns {Readonly<object>} 探测结果
 */
export function preflightHostCheck(options = {}) {
  const capabilities = options.capabilities ?? detectHostCapabilities();
  // supportOverride 便于测试构造尚未出现在矩阵里的等级
  const support = options.supportOverride ?? resolveNodeSupport(capabilities.nodeVersion);

  if (!support.meetsMinimum) {
    const error = new Error(
      `NV8 requires Node >= ${MINIMUM_NODE_VERSION.major}.${MINIMUM_NODE_VERSION.minor}, `
      + `found ${capabilities.nodeVersion}`
    );
    error.code = 'HOST_REQUIREMENT_UNAVAILABLE';
    error.context = {
      nodeVersion: capabilities.nodeVersion,
      minimum: MINIMUM_NODE_VERSION,
      tier: support.tier,
    };
    error.suggestions = [`Upgrade Node to ${MINIMUM_NODE_VERSION.major}.${MINIMUM_NODE_VERSION.minor} or newer`];
    throw error;
  }

  if (support.tier === 'best-effort' && typeof options.warn === 'function') {
    const broken = Object.values(capabilities.capabilities)
      .filter((record) => record.status !== CAPABILITY_STATUS.AVAILABLE)
      .map((record) => record.id);
    options.warn(
      `Node ${capabilities.nodeVersion} is best-effort (${support.notes}).`
      + (broken.length > 0 ? ` Degraded capabilities: ${broken.join(', ')}.` : '')
    );
  }

  return capabilities;
}

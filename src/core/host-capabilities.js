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
  Object.freeze({ range: [20, 0], tier: 'supported', notes: 'LTS; ArrayBuffer.transfer falls back to a copy' }),
  Object.freeze({ range: [18, 18], tier: 'supported', notes: 'minimum; Iterator helpers and ArrayBuffer.transfer are absent' }),
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
 * 断言一组能力全部可用，否则抛出带 reason 的结构化错误。
 *
 * @param {object} hostCapabilities
 * @param {string[]} requiredFeatures
 * @param {string} [context] 诊断上下文（Profile / 插件 ID）
 */
export function assertHostCapabilities(hostCapabilities, requiredFeatures, context = 'runtime') {
  const problems = [];
  for (const featureId of requiredFeatures) {
    const { status, reason } = hostCapabilityStatus(hostCapabilities, featureId);
    if (status !== CAPABILITY_STATUS.AVAILABLE) {
      problems.push({ featureId, status, reason });
    }
  }

  if (problems.length === 0) return;

  const summary = problems
    .map((entry) => `${entry.featureId} (${entry.status}${entry.reason ? `: ${entry.reason}` : ''})`)
    .join('; ');

  const error = new Error(
    `${context} requires unavailable host capabilities: ${summary}`
  );
  error.code = 'HOST_REQUIREMENT_UNAVAILABLE';
  error.context = {
    context,
    nodeVersion: hostCapabilities?.nodeVersion ?? process.versions.node,
    problems,
  };
  error.suggestions = problems.map((entry) => (
    entry.status === CAPABILITY_STATUS.BROKEN
      ? `Fix the runtime flag or upgrade Node so "${entry.featureId}" works`
      : `Upgrade Node or choose a profile that does not require "${entry.featureId}"`
  ));
  throw error;
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

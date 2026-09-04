/**
 * 完整 surface 快照
 *
 * 与 `surface.js` 的区别：那份只覆盖 24 个精选全局 + 10 个原型，用于快速
 * 冒烟。这份枚举**全部**全局 own key 及其原型成员，用于 Baseline 验收。
 *
 * 存储策略：fixture 只存分组摘要（每个全局一个 digest）而不是全量明细。
 * 理由是全量明细有上万条，写进 fixture 后 diff 无法阅读；分组摘要既能定位
 * 到「哪个全局变了」，又保持 fixture 可读。需要逐条对比时用 `--full` 导出。
 *
 * Node 版本差异：V8 语言内建随版本增长，实测每个 major 都不同：
 *   Array.prototype   18:36  20:40  22:40  24:40   (toSorted 等需 20+)
 *   ArrayBuffer.proto 18:3   20:6   22:9   24:9    (resize 需 20+, transfer 需 22+)
 *   String.prototype  18:50  20:52  22:52  24:52   (isWellFormed 需 20+)
 * 因此快照按 **Node major** 逐档存储，而不是粗分两档。
 */

import { createHash } from 'node:crypto';

export const FULL_SURFACE_SCHEMA = 'nv8/surface/full@1';

/**
 * 在 Realm 内执行的采集表达式。
 *
 * 设计约束：
 * - 只读取，不触发 getter（`Object.getOwnPropertyDescriptor` 而非取值）
 * - Symbol key 单独计数但不展开，避免不同引擎的 well-known symbol 顺序干扰
 * - 深度固定为「全局 + 其 prototype 成员」两层，不做递归
 */
const CAPTURE_EXPRESSION = `(() => {
  const describe = (target, key) => {
    let entry;
    try {
      entry = Object.getOwnPropertyDescriptor(target, key);
    } catch {
      return { unreadable: true };
    }
    if (!entry) return null;
    return {
      configurable: Boolean(entry.configurable),
      enumerable: Boolean(entry.enumerable),
      writable: 'writable' in entry ? Boolean(entry.writable) : null,
      getter: typeof entry.get === 'function',
      setter: typeof entry.set === 'function',
      valueType: 'value' in entry ? typeof entry.value : null,
    };
  };

  const globalKeys = Reflect.ownKeys(globalThis)
    .filter(key => typeof key === 'string')
    .sort();

  const globals = {};
  for (const name of globalKeys) {
    let valueType = 'unreadable';
    let prototypeMembers = null;
    let symbolMemberCount = 0;

    try {
      const value = globalThis[name];
      valueType = typeof value;
      const prototype = valueType === 'function' ? value.prototype : null;
      if (prototype !== null && prototype !== undefined) {
        const keys = Reflect.ownKeys(prototype);
        prototypeMembers = keys
          .filter(key => typeof key === 'string')
          .sort()
          .map(key => ({ name: key, descriptor: describe(prototype, key) }));
        symbolMemberCount = keys.filter(key => typeof key === 'symbol').length;
      }
    } catch {
      valueType = 'unreadable';
    }

    globals[name] = {
      valueType,
      descriptor: describe(globalThis, name),
      prototypeMembers,
      symbolMemberCount,
    };
  }

  return {
    schema: '${FULL_SURFACE_SCHEMA}',
    globalCount: globalKeys.length,
    symbolGlobalCount: Reflect.ownKeys(globalThis)
      .filter(key => typeof key === 'symbol').length,
    globals,
  };
})()`;

/**
 * 采集完整 surface。
 *
 * @param {(source: string) => unknown | Promise<unknown>} evaluate
 * @returns {Promise<object>} 原始快照（含全量明细）
 */
export async function captureFullSurface(evaluate) {
  if (typeof evaluate !== 'function') {
    throw new TypeError('captureFullSurface requires an evaluate function');
  }
  const serialized = await evaluate(`JSON.stringify(${CAPTURE_EXPRESSION})`);
  return JSON.parse(serialized);
}

/**
 * 把全量快照压缩成 fixture 可存的分组摘要。
 *
 * 每个全局压成一行紧凑字符串 `valueType:memberCount:symbolCount:digest16`。
 * 这样做有两个好处：
 * - 体积。legacy 有 1234 个全局，展开成对象后 fixture 超过 1MB。
 * - diff 可读性。一个全局变化只影响一行，评审时能直接看出改了什么。
 *
 * digest 截断到 16 hex（64 bit）。用途是检测意外变化而非防篡改，
 * 这个强度远超需要。
 *
 * @param {object} snapshot
 * @returns {object}
 */
export function summarizeFullSurface(snapshot) {
  if (snapshot?.schema !== FULL_SURFACE_SCHEMA) {
    throw new TypeError(`Unexpected surface schema: ${snapshot?.schema}`);
  }

  const groups = {};
  let memberTotal = 0;

  for (const name of Object.keys(snapshot.globals).sort()) {
    const entry = snapshot.globals[name];
    const memberCount = entry.prototypeMembers?.length ?? 0;
    memberTotal += memberCount;
    groups[name] = [
      entry.valueType,
      memberCount,
      entry.symbolMemberCount,
      digestOf(entry).slice(0, 16),
    ].join(':');
  }

  return {
    schema: FULL_SURFACE_SCHEMA,
    globalCount: snapshot.globalCount,
    symbolGlobalCount: snapshot.symbolGlobalCount,
    memberTotal,
    digest: digestOf({ globalCount: snapshot.globalCount, groups }),
    groups,
  };
}

/** 解析紧凑分组表示 */
function parseGroup(encoded) {
  const [valueType, memberCount, symbolMemberCount, digest] = encoded.split(':');
  return {
    valueType,
    memberCount: Number(memberCount),
    symbolMemberCount: Number(symbolMemberCount),
    digest,
  };
}

/**
 * 对比两份摘要，返回结构化差异。
 *
 * @param {object} expected
 * @param {object} actual
 * @returns {{ missing: string[], added: string[], changed: object[] }}
 */
export function diffFullSurface(expected, actual) {
  const expectedNames = new Set(Object.keys(expected.groups ?? {}));
  const actualNames = new Set(Object.keys(actual.groups ?? {}));

  const missing = [...expectedNames].filter((name) => !actualNames.has(name)).sort();
  const added = [...actualNames].filter((name) => !expectedNames.has(name)).sort();

  const changed = [];
  for (const name of [...expectedNames].filter((entry) => actualNames.has(entry)).sort()) {
    if (expected.groups[name] === actual.groups[name]) continue;
    const before = parseGroup(expected.groups[name]);
    const after = parseGroup(actual.groups[name]);
    changed.push({
      name,
      valueType: [before.valueType, after.valueType],
      memberCount: [before.memberCount, after.memberCount],
      symbolMemberCount: [before.symbolMemberCount, after.symbolMemberCount],
    });
  }

  return { missing, added, changed };
}

function digestOf(value) {
  return createHash('sha256').update(canonical(value)).digest('hex');
}

/** 稳定序列化：对象键排序，数组保序 */
function canonical(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value) ?? 'null';
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;
}

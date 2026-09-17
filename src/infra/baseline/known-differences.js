/**
 * Baseline 已知差异清单
 *
 * 为什么要有这个文件：Baseline 的价值在于「变化必须被解释」。如果每次
 * surface 有差异就直接更新 fixture，Baseline 就退化成了记录当前行为的日志，
 * 失去了守门作用。
 *
 * 因此每条差异都必须登记：
 * - `owner`：谁负责这条差异（收敛它或维护它）
 * - `severity`：严重级别，决定是否阻塞默认模式切换
 * - `reason`：为什么存在
 * - `expectation`：期望的最终状态
 *
 * 未登记的差异会让 Baseline 测试失败。
 */

/**
 * 严重级别。
 *
 * - `blocking`：阻塞默认模式从 legacy 切到 plugin
 * - `tracked`：已知且可接受，但需要收敛
 * - `environmental`：由宿主环境（Node 版本）造成，NV8 无法消除
 */
export const SEVERITY = Object.freeze({
  BLOCKING: 'blocking',
  TRACKED: 'tracked',
  ENVIRONMENTAL: 'environmental',
});

/**
 * Node 版本相关的 surface 差异。
 *
 * 这些全局在旧版 Node 上不存在，导致同一份 NV8 代码在不同 Node 上暴露的
 * surface 不同。属于 `environmental`：不是 NV8 的 bug，但必须被记录，
 * 否则跨版本跑 Baseline 会误报。
 */
export const NODE_VERSION_DEPENDENT_GLOBALS = Object.freeze([
  Object.freeze({
    name: 'Iterator',
    minimumNodeMajor: 22,
    reason: 'Iterator helpers 需要 Node 22+（V8 12.x）',
    owner: 'core-runtime',
    severity: SEVERITY.ENVIRONMENTAL,
    expectation: 'Node 18/20 上该全局缺失；install-edge-static-functions 已对缺失 owner 静默跳过',
  }),
]);

/**
 * Node 版本相关的**原型成员**差异。
 *
 * 与 `NODE_VERSION_DEPENDENT_GLOBALS` 同类，只是粒度到成员：这些是 V8 语言
 * 内建的方法，旧版 Node 的 V8 里压根没有，NV8 无法「补上」——补一个纯 JS
 * 版本反而更糟，因为 `Function.prototype.toString` 与错误文案都对不上，
 * 等于把「缺一个方法」换成「有一个假方法」。
 *
 * `minimumNodeMajor` 是**在支持矩阵内实测出来的边界**（18 / 20 / 22 / 24 各跑
 * 一遍），不是按 V8 版本推算的。比如 `ArrayBuffer.prototype.transfer` 实际随
 * Node 21 落地，但 21 不在矩阵里、无法实测，所以记 22。
 *
 * 记宽一点不会放过回归：这张表只在成员**确实缺失**时才被查询，
 * 而在已经有该成员的版本上永远走不到。
 */
export const NODE_VERSION_DEPENDENT_MEMBERS = Object.freeze([
  Object.freeze({
    prototype: 'Array',
    members: Object.freeze(['toReversed', 'toSorted', 'toSpliced', 'with']),
    minimumNodeMajor: 20,
    reason: 'Change-array-by-copy 需要 Node 20+（实测 18 无、20+ 有）',
    owner: 'core-runtime',
    severity: SEVERITY.ENVIRONMENTAL,
    expectation: 'Node 18 上缺失。这些是纯 V8 语言内建，补 JS 版本反而更糟：'
      + 'toString 与错误文案都对不上，等于把"缺一个方法"换成"有一个假方法"',
  }),
  Object.freeze({
    prototype: 'String',
    members: Object.freeze(['isWellFormed', 'toWellFormed']),
    minimumNodeMajor: 20,
    reason: 'Well-formed Unicode 字符串方法需要 Node 20+（实测 18 无）',
    owner: 'core-runtime',
    severity: SEVERITY.ENVIRONMENTAL,
    expectation: 'Node 18 上缺失；同上，不在 Realm 里补假实现',
  }),
  Object.freeze({
    prototype: 'RegExp',
    members: Object.freeze(['unicodeSets']),
    minimumNodeMajor: 20,
    reason: '正则 `v` 标志需要 Node 20+（实测 18 无）',
    owner: 'core-runtime',
    severity: SEVERITY.ENVIRONMENTAL,
    expectation: 'Node 18 上缺失。这个访问器背后是引擎的正则编译能力，'
      + '补一个恒返回 false 的假访问器只会让特性探测得到错误结论',
  }),
  // ArrayBuffer 拆成两条而不是合并：resizable 系列在 Node 20 就有，
  // transfer 系列要到 21+。合并只能取最高的门槛，于是 Node 20 上
  // resize/resizable 明明该被解释，却会报成未登记。
  Object.freeze({
    prototype: 'ArrayBuffer',
    members: Object.freeze(['maxByteLength', 'resizable', 'resize']),
    minimumNodeMajor: 20,
    reason: 'Resizable ArrayBuffer 需要 Node 20+（实测 18 无、20+ 有）',
    owner: 'core-runtime',
    severity: SEVERITY.ENVIRONMENTAL,
    expectation: 'Node 18 上缺失；这是 V8 层的 buffer 能力，用户态模拟不了',
  }),
  Object.freeze({
    prototype: 'ArrayBuffer',
    members: Object.freeze(['detached', 'transfer', 'transferToFixedLength']),
    minimumNodeMajor: 22,
    reason: 'ArrayBuffer 转移语义需要 Node 21+（实测 18/20 无、22/24 有）',
    owner: 'core-runtime',
    severity: SEVERITY.ENVIRONMENTAL,
    expectation: 'Node 18/20 上缺失。不提供用户态回退：Realm 里不塞假方法，'
      + '宿主侧需要时按 HAS_NATIVE_ARRAY_BUFFER_TRANSFER 分支',
  }),
  Object.freeze({
    prototype: 'Set',
    members: Object.freeze([
      'difference',
      'intersection',
      'isDisjointFrom',
      'isSubsetOf',
      'isSupersetOf',
      'symmetricDifference',
      'union',
    ]),
    minimumNodeMajor: 22,
    reason: 'Set 集合运算需要 Node 22+（V8 12.2；实测 18/20 无、22/24 有）',
    owner: 'core-runtime',
    severity: SEVERITY.ENVIRONMENTAL,
    expectation: 'Node 18/20 上缺失。目标脚本极少用到；真要用请升级 Node，'
      + '而不是在 Realm 里补 JS 实现',
  }),
]);

/**
 * legacy 与 plugin 两条路径之间的已知差异。
 *
 * 注意：按 ADR-0001，legacy 与 plugin 是**并存的两个产品形态**，不是新旧替换。
 * 因此“两路径 surface 不同”本身不是缺陷，不应标为 blocking。
 * 切换默认模式的真正门槛是缺失能力可诊断（ADR-0002）。
 */
export const LEGACY_PLUGIN_DIFFERENCES = Object.freeze([
  Object.freeze({
    id: 'surface-coverage-gap',
    field: 'surface.globalCount',
    owner: 'plugin-migration',
    severity: SEVERITY.TRACKED,
    reason: 'legacy 暴露 1234 个全局 / 8910 个原型成员，fullPreset 为 205 / 2121，'
      + 'domPreset 为 149 / 1671。按 ADR-0001，这是按需组装的**设计意图**而非缺陷：'
      + 'plugin 模式目标是最小可控环境，不是复刻完整浏览器。',
    expectation: '差距持续存在且可接受。登记的意义是：如果差距意外**扩大**'
      + '（如插件被误删），Baseline 仍会报出。切换默认模式的门槛已改为'
      + '缺失能力可诊断（ADR-0002）。',
  }),
  Object.freeze({
    id: 'reset-storage-retention',
    field: 'reset[0]',
    owner: 'plugin-migration',
    severity: SEVERITY.TRACKED,
    reason: 'legacy 的 navigate() 保留 localStorage，plugin 的 destroyRealm/createRealm 会重建 Realm 状态',
    expectation: '明确 reset 语义后统一：navigate 属于同 origin 导航，应保留 storage',
  }),
  Object.freeze({
    id: 'inspect-availability',
    field: 'inspect',
    owner: 'core-runtime',
    severity: SEVERITY.TRACKED,
    reason: 'legacy 公共 sandbox 不暴露 inspect()，plugin 路径通过 nv8.sandbox.inspect() 提供',
    expectation: '两条路径提供等价的诊断入口，或明确 legacy 不支持',
  }),
]);

/**
 * 判断某个全局是否因当前 Node 版本而预期缺失。
 *
 * @param {string} name
 * @param {string} [nodeVersion]
 * @returns {object|null} 命中的登记项
 */
export function expectedMissingForNode(name, nodeVersion = process.versions.node) {
  const major = Number(/^(\d+)/.exec(nodeVersion)?.[1] ?? 0);
  return NODE_VERSION_DEPENDENT_GLOBALS.find(
    (entry) => entry.name === name && major < entry.minimumNodeMajor,
  ) ?? null;
}

/**
 * 判断某个原型成员是否因当前 Node 版本而预期缺失。
 *
 * @param {string} prototype 原型所属的全局名，如 `ArrayBuffer`
 * @param {string} member 成员名，如 `transfer`
 * @param {string} [nodeVersion]
 * @returns {object|null} 命中的登记项
 */
export function expectedMissingMemberForNode(
  prototype,
  member,
  nodeVersion = process.versions.node,
) {
  const major = Number(/^(\d+)/.exec(nodeVersion)?.[1] ?? 0);
  return NODE_VERSION_DEPENDENT_MEMBERS.find((entry) => (
    entry.prototype === prototype
    && entry.members.includes(member)
    && major < entry.minimumNodeMajor
  )) ?? null;
}

/**
 * 汇总阻塞项。只要非空，就不允许把默认模式切到 plugin。
 *
 * @returns {ReadonlyArray<object>}
 */
export function blockingDifferences() {
  return LEGACY_PLUGIN_DIFFERENCES.filter(
    (entry) => entry.severity === SEVERITY.BLOCKING,
  );
}

/**
 * 校验清单自身的完整性：每条都必须有 owner、severity、reason、expectation。
 *
 * @returns {string[]} 问题描述，空数组表示合规
 */
export function validateDifferenceRegistry() {
  const problems = [];
  const seen = new Set();

  for (const entry of LEGACY_PLUGIN_DIFFERENCES) {
    if (seen.has(entry.id)) problems.push(`duplicate difference id: ${entry.id}`);
    seen.add(entry.id);
    for (const field of ['id', 'field', 'owner', 'reason', 'expectation']) {
      if (typeof entry[field] !== 'string' || entry[field].length === 0) {
        problems.push(`difference ${entry.id} is missing ${field}`);
      }
    }
    if (!Object.values(SEVERITY).includes(entry.severity)) {
      problems.push(`difference ${entry.id} has invalid severity: ${entry.severity}`);
    }
  }

  for (const entry of NODE_VERSION_DEPENDENT_GLOBALS) {
    for (const field of ['name', 'reason', 'owner', 'expectation']) {
      if (typeof entry[field] !== 'string' || entry[field].length === 0) {
        problems.push(`node-dependent global ${entry.name} is missing ${field}`);
      }
    }
    if (!Number.isInteger(entry.minimumNodeMajor)) {
      problems.push(`node-dependent global ${entry.name} needs minimumNodeMajor`);
    }
  }

  for (const entry of NODE_VERSION_DEPENDENT_MEMBERS) {
    for (const field of ['prototype', 'reason', 'owner', 'expectation']) {
      if (typeof entry[field] !== 'string' || entry[field].length === 0) {
        problems.push(`node-dependent member ${entry.prototype} is missing ${field}`);
      }
    }
    if (!Number.isInteger(entry.minimumNodeMajor)) {
      problems.push(`node-dependent member ${entry.prototype} needs minimumNodeMajor`);
    }
    // 空成员表会静默豁免整个原型——空壳条目正是这套登记机制要防的东西
    if (!Array.isArray(entry.members) || entry.members.length === 0) {
      problems.push(`node-dependent member ${entry.prototype} needs a non-empty members list`);
    }
    if (!Object.values(SEVERITY).includes(entry.severity)) {
      problems.push(`node-dependent member ${entry.prototype} has invalid severity`);
    }
  }

  return problems;
}

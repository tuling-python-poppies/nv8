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

  return problems;
}

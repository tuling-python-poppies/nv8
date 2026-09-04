/**
 * vm.SourceTextModule 链接策略兼容层
 *
 * Node 各版本的 vm modules API 并不一致：
 *
 * | API                   | 18 | 20 | 22 | 24 |
 * |-----------------------|----|----|----|----|
 * | `link()` (async)      | ✓  | ✓  | ✓  | ✓  |
 * | `dependencySpecifiers`| ✓  | ✓  | ✓  | ✓  |
 * | `moduleRequests`      | –  | –  | –  | ✓  |
 * | `linkRequests()`      | –  | –  | –  | ✓  |
 * | `instantiate()`       | –  | –  | –  | ✓  |
 *
 * Node 24 的 `linkRequests()` + `instantiate()` 是**同步**的，这让受信任的
 * 内部模块可以同步导入——大量 install-* 聚合器依赖这一点。
 *
 * Node 18–22 只有异步 `link()`，因此同步导入无法实现。策略层把这个差异
 * 显式暴露出来：`supportsSyncLink` 为 false 时，调用方必须走异步路径，
 * 而不是得到一个看起来同步、实则半初始化的模块。
 */

import vm from 'node:vm';

/** 链接策略标识 */
export const LINK_STRATEGY = Object.freeze({
  /** Node 24+：moduleRequests / linkRequests / instantiate，可同步 */
  REQUESTS_SYNC: 'requests-sync',
  /** Node 18–22：dependencySpecifiers + 异步 link() */
  LEGACY_ASYNC: 'legacy-async',
  /** vm modules 不可用 */
  UNAVAILABLE: 'unavailable',
});

let cachedStrategy = null;

/**
 * 探测当前宿主的链接策略。结果缓存，因为它在进程生命周期内不变。
 *
 * @param {object} [options]
 * @param {boolean} [options.force=false] 忽略缓存重新探测（测试用）
 * @returns {Readonly<object>}
 */
export function detectLinkStrategy(options = {}) {
  if (cachedStrategy !== null && options.force !== true) return cachedStrategy;

  if (typeof vm.SourceTextModule !== 'function') {
    cachedStrategy = Object.freeze({
      strategy: LINK_STRATEGY.UNAVAILABLE,
      supportsSyncLink: false,
      reason: 'vm.SourceTextModule is unavailable; run node with --experimental-vm-modules',
      nodeVersion: process.versions.node,
    });
    return cachedStrategy;
  }

  let probe;
  try {
    probe = new vm.SourceTextModule('export default 1;');
  } catch (error) {
    cachedStrategy = Object.freeze({
      strategy: LINK_STRATEGY.UNAVAILABLE,
      supportsSyncLink: false,
      reason: `vm.SourceTextModule construction failed: ${error.message}`,
      nodeVersion: process.versions.node,
    });
    return cachedStrategy;
  }

  const hasRequests = Array.isArray(probe.moduleRequests)
    && typeof probe.linkRequests === 'function'
    && typeof probe.instantiate === 'function';

  cachedStrategy = Object.freeze({
    strategy: hasRequests ? LINK_STRATEGY.REQUESTS_SYNC : LINK_STRATEGY.LEGACY_ASYNC,
    supportsSyncLink: hasRequests,
    reason: hasRequests
      ? null
      : 'this Node version only exposes the asynchronous link() API; use importUrlAsync()',
    nodeVersion: process.versions.node,
  });
  return cachedStrategy;
}

/**
 * 读取模块的依赖 specifier 列表，屏蔽 API 差异。
 *
 * @param {object} module vm.SourceTextModule
 * @returns {string[]}
 */
export function readDependencySpecifiers(module) {
  if (Array.isArray(module.moduleRequests)) {
    return module.moduleRequests.map((request) => request.specifier);
  }
  if (Array.isArray(module.dependencySpecifiers)) {
    return [...module.dependencySpecifiers];
  }
  return [];
}

/**
 * 是否禁止顶层 await。
 *
 * 受信任内部模块必须同步求值完毕；顶层 await 会让 `evaluate()` 挂起，
 * 使调用方拿到半初始化的 namespace。
 *
 * @param {object} module
 * @returns {boolean}
 */
export function hasTopLevelAwait(module) {
  return typeof module.hasTopLevelAwait === 'function' && module.hasTopLevelAwait();
}

/**
 * 同步链接一个已构建的依赖图（仅 Node 24+ 可用）。
 *
 * @param {object} module 根模块
 * @param {Set<object>} visited
 */
export function linkGraphSync(module, visited = new Set()) {
  const { supportsSyncLink, reason } = detectLinkStrategy();
  if (!supportsSyncLink) {
    const error = new TypeError(
      `Synchronous module linking is unavailable on Node ${process.versions.node}: ${reason}`
    );
    error.code = 'ERR_NV8_MODULE_SYNC_LINK_UNAVAILABLE';
    throw error;
  }

  if (visited.has(module)) return;
  visited.add(module);

  for (const dependency of module.internalDependencies ?? []) {
    linkGraphSync(dependency, visited);
  }

  if (module.status === 'unlinked') {
    module.linkRequests(module.internalDependencies ?? []);
  }
}

/**
 * 异步链接一个模块图，适用于所有支持 vm modules 的 Node 版本。
 *
 * @param {object} module 根模块
 * @param {(specifier: string, referencingModule: object) => Promise<object>|object} resolveDependency
 * @returns {Promise<void>}
 */
export async function linkGraphAsync(module, resolveDependency) {
  if (module.status !== 'unlinked') return;
  await module.link(async (specifier, referencingModule) => (
    resolveDependency(specifier, referencingModule)
  ));

  // Node 24 的 link() 只解析依赖，不推进到 linked；
  // 需要额外的 instantiate()。Node 18–22 的 link() 已经完成实例化。
  if (module.status === 'unlinked' && typeof module.instantiate === 'function') {
    module.instantiate();
  }
}

/**
 * 求值一个已链接模块，并断言它同步完成。
 *
 * @param {object} module
 * @param {string} [label] 诊断标签
 */
export function evaluateSync(module, label = 'trusted internal module') {
  if (module.status === 'evaluated') return;

  if (module.status === 'unlinked') {
    if (typeof module.instantiate === 'function') {
      module.instantiate();
    } else {
      const error = new TypeError(
        `${label} cannot be instantiated synchronously on Node ${process.versions.node}`
      );
      error.code = 'ERR_NV8_MODULE_SYNC_LINK_UNAVAILABLE';
      throw error;
    }
  }

  if (module.status !== 'linked') return;

  if (hasTopLevelAwait(module)) {
    const error = new TypeError(`Top-level await is forbidden in ${label}`);
    error.code = 'ERR_NV8_MODULE_TOP_LEVEL_AWAIT';
    throw error;
  }

  const evaluation = module.evaluate();

  if (module.status === 'errored') {
    void evaluation.catch(() => {});
    throw module.error;
  }

  if (module.status !== 'evaluated') {
    void evaluation.catch(() => {});
    const error = new TypeError(`${label} did not evaluate synchronously`);
    error.code = 'ERR_NV8_MODULE_ASYNC_EVALUATION';
    throw error;
  }
}

/**
 * 求值一个已链接模块，允许异步完成。
 *
 * @param {object} module
 * @returns {Promise<void>}
 */
export async function evaluateAsync(module) {
  if (module.status === 'evaluated') return;
  await module.evaluate();
  if (module.status === 'errored') throw module.error;
}

/**
 * 重置探测缓存（仅测试使用）
 */
export function resetLinkStrategyCache() {
  cachedStrategy = null;
}

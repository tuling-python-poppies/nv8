import { Buffer } from "node:buffer";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import {
  detectLinkStrategy,
  evaluateAsync,
  evaluateSync,
  linkGraphAsync,
  linkGraphSync,
  readDependencySpecifiers,
} from "./module-link-strategy.js";

// `src/` 根。模块加载器只放行这个前缀之下的 `file:` URL，所以它必须指向 src/
// 而不是 `src/engine/`——表面代码住在 `src/surface/`，指错一级会把整个表面挡在外面。
const SOURCE_ROOT = new URL("../../", import.meta.url);
const BUNDLE_PATH = fileURLToPath(new URL("./module-bundle.json", import.meta.url));
const INTERNAL_MODULES = Object.freeze({
  "edge-internal:bootstrap-root": new URL(
    "../bootstrap/bootstrap-root.js",
    import.meta.url,
  ),
  "edge-internal:bootstrap-worker": new URL(
    "../bootstrap/bootstrap-worker.js",
    import.meta.url,
  ),
  "edge-internal:bootstrap-worklet": new URL(
    "../bootstrap/bootstrap-worklet.js",
    import.meta.url,
  ),
});

// This cache is isolate-local. In a persistent Worker Thread it removes both
// filesystem reads and repeated V8 parsing while every Realm still receives
// fresh SourceTextModule instances bound to its own vm.Context.
const SOURCE_CACHE = new Map();

// Pre-load the bundle if available — single readFileSync replaces 3989 calls.
let bundleLoaded = false;
function ensureBundleLoaded() {
  if (bundleLoaded) return;
  bundleLoaded = true;
  try {
    if (!existsSync(BUNDLE_PATH)) return;
    const raw = readFileSync(BUNDLE_PATH, "utf8");
    /* istanbul ignore next */
    if (raw.length === 0) return;
    const bundle = JSON.parse(raw);
    const identifiers = Object.keys(bundle);
    for (let i = 0; i < identifiers.length; i++) {
      const id = identifiers[i];
      if (!SOURCE_CACHE.has(id)) {
        const entry = bundle[id];
        const cached = { source: typeof entry === "string" ? entry : entry.source, cachedData: null };
        if (typeof entry === "object" && entry.cachedData) {
          cached.cachedData = Buffer.from(entry.cachedData, "base64");
        }
        SOURCE_CACHE.set(id, cached);
      }
    }
  } catch {
    // Bundle is optional; fall back to per-file reads.
  }
}

export class RealmModuleLoader {
  constructor(context) {
    this.context = context;
    this.modules = new Map();
    this.closed = false;
    this.pending = new Set();
  }

  #lifecycleError() {
    const error = new TypeError("Realm module evaluation was cancelled");
    error.code = "ERR_NV8_MODULE_EVALUATION_CANCELLED";
    return error;
  }

  #assertOpen() {
    if (this.closed) throw this.#lifecycleError();
  }

  #track(operation) {
    this.#assertOpen();
    let cancel;
    const cancellation = new Promise((_, reject) => {
      cancel = reject;
    });
    const pending = { cancel };
    this.pending.add(pending);
    const work = Promise.resolve().then(operation);
    return Promise.race([work, cancellation]).finally(() => {
      this.pending.delete(pending);
    });
  }

  importInternal(specifier) {
    const url = INTERNAL_MODULES[specifier];
    if (url === undefined) {
      throw new TypeError("Internal sandbox module is not registered");
    }
    return this.importUrl(url);
  }

  /**
   * 异步导入内部模块（按注册名）。
   * @param {string} specifier
   * @returns {Promise<object>}
   */
  async importInternalAsync(specifier) {
    const url = INTERNAL_MODULES[specifier];
    if (url === undefined) {
      throw new TypeError("Internal sandbox module is not registered");
    }
    return this.importUrlAsync(url);
  }

  importUrl(url) {
    this.#assertOpen();
    ensureBundleLoaded();
    if (!(url instanceof URL)) {
      throw new TypeError("Internal module URL must be a URL");
    }

    // 同步导入仅在提供同步链接 API 的 Node 上可用。
    // 其余版本必须显式走 importUrlAsync()，而不是拿到半初始化模块。
    const { supportsSyncLink, reason } = detectLinkStrategy();
    if (!supportsSyncLink) {
      const error = new TypeError(
        `Synchronous internal module import is unavailable on Node ${process.versions.node}: ${reason}`,
      );
      error.code = "ERR_NV8_MODULE_SYNC_LINK_UNAVAILABLE";
      error.suggestions = [
        "Use loader.importUrlAsync(url) on this Node version",
        "Or run on Node 24+ where vm module linking is synchronous",
      ];
      throw error;
    }

    const module = this.loadGraph(url);
    linkGraphSync(module);
    evaluateSync(module, `trusted internal module ${url.href}`);
    return module;
  }

  /**
   * 异步导入内部模块。在所有支持 vm modules 的 Node 版本上可用。
   *
   * 与 {@link importUrl} 的区别：依赖解析和链接走异步 `link()`，
   * 因此不依赖 Node 24 的 linkRequests/instantiate。
   *
   * @param {URL} url
   * @returns {Promise<object>} vm.SourceTextModule
   */
  async importUrlAsync(url) {
    return this.#track(async () => {
      ensureBundleLoaded();
      if (!(url instanceof URL)) {
        throw new TypeError("Internal module URL must be a URL");
      }

      // 与同步路径一致的三阶段：先建图，再链接，最后求值。
      // 必须分阶段：循环依赖（如 navigator-state ↔ navigator-constructor）下，
      // 边递归边 link 会把未完成链接的模块交给 link() 回调而失败。
      const module = this.loadGraph(url);
      await this.#linkGraphAsync(module, new Set());
      this.#assertOpen();
      await evaluateAsync(module);
      this.#assertOpen();
      return module;
    });
  }

  /**
   * 深度优先异步链接已构建好的图。
   *
   * 图已由 {@link loadGraph} 完成，`internalDependencies` 可直接查询，
   * 因此 link() 回调只做查表，不再触发新的加载。
   */
  async #linkGraphAsync(module, visited) {
    if (visited.has(module)) return;
    visited.add(module);

    for (const dependency of module.internalDependencies ?? []) {
      await this.#linkGraphAsync(dependency, visited);
    }

    if (module.status !== "unlinked") return;

    // 必须用回调实际传入的 referencingModule 做解析：
    // link() 会沿图递归请求子模块的依赖，此时 referrer 不是根模块。
    // 用闭包里的 module 会把子模块的相对路径错误地相对根目录解析。
    await linkGraphAsync(module, (specifier, referencingModule) => {
      const referrer = referencingModule ?? module;
      const childUrl = this.resolve(specifier, referrer);
      return this.modules.get(childUrl.href) ?? this.loadGraph(childUrl);
    });
  }

  /**
   * 预加载一组模块，使其后的 {@link importUrlSyncCached} 可以同步取用。
   *
   * 存在意义：Node 18–22 无法同步链接，但有些调用点（如 ServiceWorker
   * controllerchange 回调、postMessage 派送）必须保持同步语义。解法是在
   * Realm 创建阶段（异步上下文）先把这些模块求值完，回调里只查表。
   *
   * @param {URL[]} urls
   * @returns {Promise<void>}
   */
  async preload(urls) {
    this.#assertOpen();
    for (const url of urls) {
      if (!(url instanceof URL)) {
        throw new TypeError("Preloaded module URL must be a URL");
      }
      if (this.modules.get(url.href)?.status === "evaluated") continue;
      await this.importUrlAsync(url);
    }
  }

  /**
   * 同步取已求值的模块。
   *
   * 在支持同步链接的宿主上，未缓存时会回退到 {@link importUrl}；
   * 不支持的宿主上未缓存则抛错，提示先调 preload()。
   *
   * @param {URL} url
   * @returns {object} vm.SourceTextModule
   */
  importUrlSyncCached(url) {
    this.#assertOpen();
    const cached = this.modules.get(url.href);
    if (cached !== undefined && cached.status === "evaluated") return cached;

    if (detectLinkStrategy().supportsSyncLink) return this.importUrl(url);

    const error = new TypeError(
      `Module "${url.href}" was not preloaded and this host cannot link synchronously`,
    );
    error.code = "ERR_NV8_MODULE_NOT_PRELOADED";
    error.suggestions = [
      "Call loader.preload([url]) during realm creation before using it in a synchronous callback",
    ];
    throw error;
  }

  /**
   * 当前宿主的链接策略快照，用于诊断和能力上报
   * @returns {Readonly<object>}
   */
  linkStrategy() {
    return detectLinkStrategy();
  }

  loadGraph(url) {
    this.#assertOpen();
    const identifier = url.href;
    const cached = this.modules.get(identifier);
    if (cached !== undefined) {
      return cached;
    }
    const module = this.createModule(url, identifier);
    this.modules.set(identifier, module);
    try {
      // 依赖 specifier 读取屏蔽了 moduleRequests / dependencySpecifiers 的差异
      const dependencies = readDependencySpecifiers(module).map(specifier => {
        const childUrl = this.resolve(specifier, module);
        return this.loadGraph(childUrl);
      });
      module.internalDependencies = dependencies;
      return module;
    } catch (error) {
      if (this.modules.get(identifier) === module) {
        this.modules.delete(identifier);
      }
      throw error;
    }
  }

  createModule(url, identifier) {
    assertInsideSourceRoot(url);
    let cached = SOURCE_CACHE.get(identifier);
    if (cached === undefined) {
      cached = {
        source: readFileSync(url, "utf8"),
        cachedData: null,
      };
      SOURCE_CACHE.set(identifier, cached);
    }
    const options = {
      context: this.context,
      identifier,
      initializeImportMeta(meta) {
        meta.url = identifier;
      },
      importModuleDynamically() {
        throw new TypeError("Dynamic import is disabled for internal modules");
      },
    };
    if (cached.cachedData !== null) options.cachedData = cached.cachedData;
    let module;
    try {
      module = new vm.SourceTextModule(cached.source, options);
    } catch (error) {
      if (cached.cachedData === null) throw error;
      cached.cachedData = null;
      delete options.cachedData;
      module = new vm.SourceTextModule(cached.source, options);
    }
    if (cached.cachedData === null) {
      cached.cachedData = module.createCachedData();
    }
    return module;
  }

  linkGraph(module, visited) {
    // 保留旧方法名作为兼容入口，内部转到策略层
    linkGraphSync(module, visited ?? new Set());
  }

  dispose() {
    if (this.closed) return;
    this.closed = true;
    const error = this.#lifecycleError();
    for (const pending of this.pending) pending.cancel(error);
    this.pending.clear();
    this.modules.clear();
    this.context = null;
  }

  cacheStats() {
    return Object.freeze({
      entries: this.modules.size,
      pending: this.pending.size,
      closed: this.closed,
    });
  }

  resolve(specifier, referencingModule) {
    this.#assertOpen();
    if (
      specifier.startsWith("node:")
      || specifier.startsWith("file:")
      || !specifier.startsWith(".")
    ) {
      throw new TypeError("Internal module import is not permitted");
    }
    const url = new URL(specifier, referencingModule.identifier);
    assertInsideSourceRoot(url);
    return url;
  }
}

export function realmModuleCacheStats() {
  let sourceBytes = 0;
  let cachedDataBytes = 0;
  for (const cached of SOURCE_CACHE.values()) {
    sourceBytes += Buffer.byteLength(cached.source, "utf8");
    cachedDataBytes += cached.cachedData?.byteLength ?? 0;
  }
  return Object.freeze({
    entries: SOURCE_CACHE.size,
    sourceBytes,
    cachedDataBytes,
  });
}

function assertInsideSourceRoot(url) {
  if (url.protocol !== "file:" || !url.href.startsWith(SOURCE_ROOT.href)) {
    throw new TypeError("Internal module resolved outside the runtime source tree");
  }
}

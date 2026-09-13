const MODERN_BUILTINS_URL = new URL(
  "../../surface/install/install-modern-builtins.js",
  import.meta.url,
);
const DATE_PROFILE_URL = new URL(
  "../../surface/install/install-date-profile.js",
  import.meta.url,
);
const INTL_BREAK_ITERATOR_URL = new URL(
  "../../surface/install/install-intl-v8-break-iterator.js",
  import.meta.url,
);

/**
 * @nv8/plugin-builtins
 * 
 * 现代 JavaScript 内置对象
 * 
 * 提供能力：
 * - builtins.modern: 现代 JS 内置对象、Date 和 Intl
 *
 * ## 为什么真正的安装移到 activate（IKFD9P）
 *
 * 与 `@nv8/plugin-errors` 同因：三参数 install 被判为 legacy 后整体跳过，
 * `DisposableStack` / `Temporal` / `Float16Array` / `getOrInsert` /
 * `toBase64` 等现代内建在 createNv8 路径上全部缺失。install 现在只做
 * 表面登记（显式 `legacy: false`），安装经 Realm 的 moduleLoader 在
 * activate 内完成。
 */
export const builtinsPlugin = {
  id: "@nv8/plugin-builtins",
  version: "1.0.0",
  capabilities: ["builtins.modern"],
  dependencies: [],
  // 显式标记：install 不再调用宿主 globalThis 上的安装器（IKFD9P）
  legacy: false,
  
  install(context) {
    const registry = context.surfaceRegistry;
    // 注册全局表面
    registry.reserveGlobalSurface(this.id, "Promise");
    registry.reserveGlobalSurface(this.id, "Symbol");
    registry.reserveGlobalSurface(this.id, "Map");
    registry.reserveGlobalSurface(this.id, "Set");
    registry.reserveGlobalSurface(this.id, "WeakMap");
    registry.reserveGlobalSurface(this.id, "WeakSet");
    registry.reserveGlobalSurface(this.id, "Proxy");
    registry.reserveGlobalSurface(this.id, "Reflect");
    registry.reserveGlobalSurface(this.id, "Date");
    registry.reserveGlobalSurface(this.id, "Intl");
  },

  /**
   * 在 Realm 内安装现代内建。
   *
   * 三个安装器都经 Realm 的 moduleLoader 求值，`globalThis` 是目标 Realm，
   * 不影响宿主进程。
   */
  async activate(context) {
    const loader = context.moduleLoader;
    if (!loader?.importUrlAsync) {
      throw new Error('Realm module loader cannot install modern builtins');
    }
    const browserMajorVersion = Number(context.runtime?.browserMajorVersion ?? 150);

    const builtinsModule = await loader.importUrlAsync(MODERN_BUILTINS_URL);
    const installBuiltins = builtinsModule?.namespace?.installModernBuiltins;
    if (typeof installBuiltins !== 'function') {
      throw new Error('Realm module loader cannot install modern builtins');
    }
    installBuiltins();

    const dateModule = await loader.importUrlAsync(DATE_PROFILE_URL);
    const installDate = dateModule?.namespace?.installDateProfile;
    if (typeof installDate !== 'function') {
      throw new Error('Realm module loader cannot install Date profile');
    }
    installDate();

    const intlModule = await loader.importUrlAsync(INTL_BREAK_ITERATOR_URL);
    const installIntlBreakIterator = intlModule?.namespace?.installIntlV8BreakIterator;
    if (typeof installIntlBreakIterator !== 'function') {
      throw new Error('Realm module loader cannot install Intl V8BreakIterator');
    }
    installIntlBreakIterator(browserMajorVersion >= 151);

    context.exports.builtins = true;
    context.exports.browserMajorVersion = browserMajorVersion;
  },
  
  reset(sandbox, registry) {
    // 内置对象不需要重置
  },
  
  dispose(sandbox, registry) {
    // 清理在 dispose 时处理
  },
};

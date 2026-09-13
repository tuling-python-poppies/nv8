const ERROR_STACK_GUARD_URL = new URL(
  "../../engine/bootstrap/install-error-stack-guard.js",
  import.meta.url,
);
const ERROR_OBJECTS_URL = new URL(
  "../../surface/install/install-error-objects.js",
  import.meta.url,
);

/**
 * @nv8/plugin-errors
 * 
 * 错误对象和堆栈保护
 * 
 * 提供能力：
 * - errors.base: Error 堆栈保护和错误对象
 *
 * ## 为什么真正的安装移到 activate（IKFD9P）
 *
 * 旧式三参数 `install(sandbox, registry, config)` 会被注册表判为 legacy，
 * 而 legacy 插件的 install 被 Core **保守跳过**——因为那些 `install-*`
 * 函数操作的是宿主的 `globalThis`，在 Realm 建立之前执行会污染宿主进程。
 * 结果是这个插件在 `createNv8` 路径上完全不生效：Error.stack 里能看到
 * `node:vm` / `file:///C:/...` 宿主帧，`DisposableStack` / `Temporal` /
 * `Float16Array` 等现代内建全部缺失。
 *
 * 修复方式与 canvas 插件一致：install 只做表面登记（显式标记
 * `legacy: false`，语义是「install 不触碰宿主全局」），真正安装放在
 * `activate(context)` 里，经 Realm 自己的 moduleLoader 求值安装器，
 * 作用对象自然是该 Realm 的 globalThis。
 */
export const errorsPlugin = {
  id: "@nv8/plugin-errors",
  version: "1.0.0",
  capabilities: ["errors.base"],
  dependencies: [],
  supports: { realms: ['root', 'iframe', 'worker', 'worklet'] },
  // 显式标记：install 不再调用宿主 globalThis 上的安装器（IKFD9P）
  legacy: false,
  
  install(context) {
    const registry = context.surfaceRegistry;
    // 注册全局表面
    registry.reserveGlobalSurface(this.id, "Error");
    registry.reserveGlobalSurface(this.id, "EvalError");
    registry.reserveGlobalSurface(this.id, "RangeError");
    registry.reserveGlobalSurface(this.id, "ReferenceError");
    registry.reserveGlobalSurface(this.id, "SyntaxError");
    registry.reserveGlobalSurface(this.id, "TypeError");
    registry.reserveGlobalSurface(this.id, "URIError");
    registry.reserveGlobalSurface(this.id, "AggregateError");
  },

  /**
   * 在 Realm 内安装错误堆栈保护与错误对象。
   *
   * `installErrorStackGuard` / `installErrorObjects` 通过 Realm 的
   * moduleLoader 加载，模块在 Realm 内求值，`globalThis` 即目标 Realm，
   * 因此不会污染宿主进程。
   */
  async activate(context) {
    const loader = context.moduleLoader;
    if (!loader?.importUrlAsync) {
      throw new Error('Realm module loader cannot install error objects');
    }
    const browserMajorVersion = Number(context.runtime?.browserMajorVersion ?? 150);

    const stackGuardModule = await loader.importUrlAsync(ERROR_STACK_GUARD_URL);
    const installStackGuard = stackGuardModule?.namespace?.installErrorStackGuard;
    if (typeof installStackGuard !== 'function') {
      throw new Error('Realm module loader cannot install Error stack guard');
    }
    installStackGuard(browserMajorVersion >= 151);

    const errorObjectsModule = await loader.importUrlAsync(ERROR_OBJECTS_URL);
    const installObjects = errorObjectsModule?.namespace?.installErrorObjects;
    if (typeof installObjects !== 'function') {
      throw new Error('Realm module loader cannot install Error objects');
    }
    installObjects();

    context.exports.errors = true;
    context.exports.browserMajorVersion = browserMajorVersion;
  },
  
  reset(sandbox, registry) {
    // 错误对象不需要重置
  },
  
  dispose(sandbox, registry) {
    // 清理在 dispose 时处理
  },
};

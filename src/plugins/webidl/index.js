const NATIVE_FUNCTION_INFRASTRUCTURE_URL = new URL(
  "../../engine/webidl/native-function.js",
  import.meta.url,
);

/**
 * @nv8/plugin-webidl
 * 
 * WebIDL 基础设施和原生函数注册
 * 
 * 提供能力：
 * - webidl.base: 原生函数 toString 和注册表
 */
export const webidlPlugin = {
  id: "@nv8/plugin-webidl",
  version: "1.0.0",
  capabilities: ["webidl.base"],
  dependencies: [],
  supports: { realms: ['root', 'iframe', 'worker', 'worklet'] },
  
  install(context) {
    // Reserve the surface; realm-specific configuration happens in activate.
    // 注册全局表面
    context.surfaceRegistry?.reserveGlobalSurface(
      context.plugin.id,
      "Function.prototype.toString",
    );
  },
  
  async activate(context) {
    // 原生函数基础设施必须在 **Realm 模块图内**安装（IKF39V(c)）：
    // `registerNativeFunction` 等 API 是 Realm 模块的模块级状态，每个 Realm
    // 一份；在宿主侧创建上下文只会配到宿主实例，Realm 安装器的注册会永远
    // 滞留在队列里，`Function.prototype.toString` 也就拿不到原生伪装。
    const loader = context.moduleLoader;
    if (!loader?.importUrlAsync) {
      throw new Error(
        "Realm module loader cannot install WebIDL native function infrastructure",
      );
    }
    const module = await loader.importUrlAsync(
      NATIVE_FUNCTION_INFRASTRUCTURE_URL,
    );
    const install = module?.namespace?.installNativeFunctionInfrastructure;
    if (typeof install !== "function") {
      throw new Error(
        "Realm module loader cannot install WebIDL native function infrastructure",
      );
    }
    const nativeContext = install(context.globals.nativeFunctionRegistry);
    
    // Export both the registry and the context for installers
    context.exports.nativeFunctionRegistry = context.globals.nativeFunctionRegistry;
    context.exports.nativeContext = nativeContext;
  },
  
  reset() {
    // WebIDL 基础设施不需要重置
  },
  
  async dispose(context) {
    // Realm 模块图随 Realm 销毁释放；本插件不再持有任何宿主侧共享上下文
    // （原先的 getNativeFunctionContext(realmId) / setNativeFunctionContext
    // 已删除，见 IKF39V(c)）。
  },
};

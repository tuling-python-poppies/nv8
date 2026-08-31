import { getNativeFunctionContext, removeNativeFunctionContext } from "../../webidl/native-function-realm-safe.js";
import { setNativeFunctionContext } from "../../webidl/native-function.js";

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
    // Get or create Realm-local native function context using realm ID
    const nativeContext = getNativeFunctionContext(context.realm.id);
    
    // Configure the cross-realm registry
    nativeContext.configureRegistry(context.globals.nativeFunctionRegistry);
    
    // Install Function.prototype.toString override
    nativeContext.installToString(context.global.Function.prototype);
    
    // Set the context for legacy API compatibility
    // This allows descriptor.js and other legacy code to work
    setNativeFunctionContext(nativeContext);
    
    // Export both the registry and the context for installers
    context.exports.nativeFunctionRegistry = context.globals.nativeFunctionRegistry;
    context.exports.nativeContext = nativeContext;
  },
  
  reset() {
    // WebIDL 基础设施不需要重置
  },
  
  async dispose(context) {
    // Clear the context on disposal
    setNativeFunctionContext(null);
    removeNativeFunctionContext(context.realm.id);
  },
};

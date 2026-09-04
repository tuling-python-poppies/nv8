import { installErrorStackGuard } from "../../engine/bootstrap/install-error-stack-guard.js";
import { installErrorObjects } from "../../surface/install/install-error-objects.js";

/**
 * @nv8/plugin-errors
 * 
 * 错误对象和堆栈保护
 * 
 * 提供能力：
 * - errors.base: Error 堆栈保护和错误对象
 */
export const errorsPlugin = {
  id: "@nv8/plugin-errors",
  version: "1.0.0",
  capabilities: ["errors.base"],
  dependencies: [],
  supports: { realms: ['root', 'iframe', 'worker', 'worklet'] },
  
  install(sandbox, registry, config) {
    const { browserMajorVersion = 150 } = config;
    
    // 安装错误堆栈保护
    installErrorStackGuard(browserMajorVersion >= 151);
    
    // 安装错误对象
    installErrorObjects();
    
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
  
  reset(sandbox, registry) {
    // 错误对象不需要重置
  },
  
  dispose(sandbox, registry) {
    // 清理在 dispose 时处理
  },
};

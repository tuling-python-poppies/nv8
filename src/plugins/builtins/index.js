import { installModernBuiltins } from "../../install/install-modern-builtins.js";
import { installDateProfile } from "../../install/install-date-profile.js";
import { installIntlV8BreakIterator } from "../../install/install-intl-v8-break-iterator.js";

/**
 * @nv8/plugin-builtins
 * 
 * 现代 JavaScript 内置对象
 * 
 * 提供能力：
 * - builtins.modern: 现代 JS 内置对象、Date 和 Intl
 */
export const builtinsPlugin = {
  id: "@nv8/plugin-builtins",
  version: "1.0.0",
  capabilities: ["builtins.modern"],
  dependencies: [],
  
  install(sandbox, registry, config) {
    const { browserMajorVersion = 150 } = config;
    
    // 安装现代内置对象
    installModernBuiltins();
    
    // 安装 Date profile
    installDateProfile();
    
    // 安装 Intl V8 BreakIterator
    installIntlV8BreakIterator(browserMajorVersion >= 151);
    
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
  
  reset(sandbox, registry) {
    // 内置对象不需要重置
  },
  
  dispose(sandbox, registry) {
    // 清理在 dispose 时处理
  },
};

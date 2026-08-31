/**
 * @nv8/plugin-url
 * 
 * URL API
 * 
 * 提供能力：
 * - url.base: URL, URLSearchParams
 */
export const urlPlugin = {
  id: "@nv8/plugin-url",
  version: "1.0.0",
  capabilities: ["url.base"],
  dependencies: ["@nv8/plugin-webidl"],
  
  install(sandbox, registry, config) {
    // Legacy installer retained for the bootstrap adapter. Core uses activate.
    // 注册全局表面
    registry.reserveGlobalSurface(this.id, "URL");
    registry.reserveGlobalSurface(this.id, "URLSearchParams");
  },
  
  async activate(context) {
    context.global.URL = URL;
    context.global.URLSearchParams = URLSearchParams;
    context.exports.URL = URL;
    context.exports.URLSearchParams = URLSearchParams;
  },
  
  reset(sandbox, registry) {
    // URL API 不需要重置
  },
  
  dispose(sandbox, registry) {
    // 清理在 dispose 时处理
  },
};

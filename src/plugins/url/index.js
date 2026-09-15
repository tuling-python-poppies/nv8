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
    const installer = await context.moduleLoader.importUrlAsync(new URL(
      '../../surface/install/install-url.js',
      import.meta.url,
    ));
    const searchParamsInstaller = await context.moduleLoader.importUrlAsync(new URL(
      '../../surface/install/install-url-search-params.js',
      import.meta.url,
    ));
    searchParamsInstaller.namespace.installURLSearchParams();
    installer.namespace.installURL();
    context.exports.URL = context.global.URL;
    context.exports.URLSearchParams = context.global.URLSearchParams;
  },
  
  reset(sandbox, registry) {
    // URL API 不需要重置
  },
  
  dispose(sandbox, registry) {
    // 清理在 dispose 时处理
  },
};

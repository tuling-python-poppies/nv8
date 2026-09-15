/**
 * @nv8/plugin-console
 * 
 * Console API
 * 
 * 提供能力：
 * - console.base: console 对象和所有方法
 */
export const consolePlugin = {
  id: "@nv8/plugin-console",
  version: "1.0.0",
  capabilities: ["console.base"],
  dependencies: [],
  
  install(sandbox, registry, config) {
    // Legacy installer retained for the bootstrap adapter. Core uses activate.
    // 注册全局表面
    registry.reserveGlobalSurface(this.id, "console");
  },
  
  async activate(context) {
    const installer = await context.moduleLoader.importUrlAsync(new URL(
      '../../surface/install/install-console.js',
      import.meta.url,
    ));
    installer.namespace.installConsole();
    context.exports.console = context.global.console;
  },
  
  reset(sandbox, registry) {
    // Console 不需要重置
  },
  
  dispose(sandbox, registry) {
    // 清理在 dispose 时处理
  },
};

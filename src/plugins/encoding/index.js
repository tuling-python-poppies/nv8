/**
 * @nv8/plugin-encoding
 * 
 * Encoding API
 * 
 * 提供能力：
 * - encoding.text: TextEncoder, TextDecoder
 */
export const encodingPlugin = {
  id: "@nv8/plugin-encoding",
  version: "1.0.0",
  capabilities: ["encoding.text"],
  dependencies: ["@nv8/plugin-webidl"],
  
  install(sandbox, registry, config) {
    // Legacy installer retained for the bootstrap adapter. Core uses activate.
    // 注册全局表面
    registry.reserveGlobalSurface(this.id, "TextEncoder");
    registry.reserveGlobalSurface(this.id, "TextDecoder");
  },
  
  async activate(context) {
    const installer = await context.moduleLoader.importUrlAsync(new URL(
      '../../surface/install/install-text-encoding.js',
      import.meta.url,
    ));
    installer.namespace.installTextEncoding();
    context.exports.TextEncoder = context.global.TextEncoder;
    context.exports.TextDecoder = context.global.TextDecoder;
  },
  
  reset(sandbox, registry) {
    // Encoding API 不需要重置
  },
  
  dispose(sandbox, registry) {
    // 清理在 dispose 时处理
  },
};

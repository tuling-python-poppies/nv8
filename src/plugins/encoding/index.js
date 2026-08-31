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
    const { global } = context;
    global.TextEncoder = TextEncoder;
    global.TextDecoder = TextDecoder;
    context.exports.TextEncoder = TextEncoder;
    context.exports.TextDecoder = TextDecoder;
  },
  
  reset(sandbox, registry) {
    // Encoding API 不需要重置
  },
  
  dispose(sandbox, registry) {
    // 清理在 dispose 时处理
  },
};

/**
 * @nv8/plugin-canvas
 * 
 * Canvas API
 * 
 * 提供能力：
 * - canvas.base: Canvas 2D/3D 支持
 */
export const canvasPlugin = {
  id: "@nv8/plugin-canvas",
  version: "1.0.0",
  capabilities: ["canvas.base"],
  dependencies: ["html.base"],
  
  install(sandbox, registry, config) {
    // Canvas 实现待补充
    // 暂时只提供占位
  },
  
  reset(sandbox, registry) {
    // Canvas 重置
  },
  
  dispose(sandbox, registry) {
    // Canvas 清理
  },
};

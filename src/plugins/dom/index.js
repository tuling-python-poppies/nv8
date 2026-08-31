/**
 * @nv8/plugin-dom
 * 
 * DOM API (合并版)
 * 
 * 提供能力：
 * - dom.base: 基础 DOM 操作
 */
export const domPlugin = {
  id: "@nv8/plugin-dom",
  version: "1.0.0",
  capabilities: ["dom.base"],
  dependencies: ["dom-core.base", "dom-collections.base"],
  
  install(sandbox, registry, config) {
    // DOM 实现已通过 dom-core 和 dom-collections 提供
    // 这个插件主要用于依赖管理
  },
  
  reset(sandbox, registry) {
    // DOM 重置由 dom-core 处理
  },
  
  dispose(sandbox, registry) {
    // DOM 清理由 dom-core 处理
  },
};

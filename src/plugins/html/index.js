/**
 * @nv8/plugin-html
 * 
 * HTML Elements API
 * 
 * 提供能力：
 * - html.base: HTML 元素支持
 */
export const htmlPlugin = {
  id: "@nv8/plugin-html",
  version: "1.0.0",
  capabilities: ["html.base"],
  dependencies: ["dom.base"],
  
  install(sandbox, registry, config) {
    // HTML 元素实现已通过 html-elements 提供
    // 这个插件主要用于依赖管理
  },
  
  reset(sandbox, registry) {
    // HTML 重置由具体实现处理
  },
  
  dispose(sandbox, registry) {
    // HTML 清理由具体实现处理
  },
};

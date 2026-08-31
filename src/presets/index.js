import {
  webidlPlugin,
  errorsPlugin,
  builtinsPlugin,
  consolePlugin,
  eventsPlugin,
  abortPlugin,
  htmlElementsPlugin,
  domExceptionPlugin,
  domCorePlugin,
  domCollectionsPlugin,
  domPlugin,
  htmlPlugin,
  canvasPlugin,
  streamsPlugin,
  timersPlugin,
  storagePlugin,
  fetchPlugin,
  xhrPlugin,
  websocketPlugin,
  windowPlugin,
  navigatorPlugin,
  locationPlugin,
  historyPlugin,
  performancePlugin,
  encodingPlugin,
  urlPlugin,
  cryptoPlugin,
  messagingPlugin,
} from "../plugins/index.js";

/**
 * 最小预设
 * 
 * 只包含基础的 JavaScript 运行时增强，不包含任何浏览器 API
 * 适用场景：纯 JS 逆向、Node.js 环境补充
 */
export const minimalPreset = [
  webidlPlugin,
  errorsPlugin,
  builtinsPlugin,
  consolePlugin,
];

/**
 * 基础预设
 * 
 * 包含最常用的浏览器 API，适合大多数场景
 * 适用场景：常规 Web 逆向、基础浏览器环境模拟
 */
export const basicPreset = [
  ...minimalPreset,
  eventsPlugin,
  domExceptionPlugin,
  abortPlugin,
  timersPlugin,
  encodingPlugin,
  urlPlugin,
  cryptoPlugin,
];

/**
 * DOM 预设
 * 
 * 包含完整的 DOM API 支持
 * 适用场景：需要 DOM 操作的场景
 */
export const domPreset = [
  ...basicPreset,
  domCorePlugin,
  domCollectionsPlugin,
  domPlugin,
  htmlElementsPlugin,
  htmlPlugin,
];

/**
 * 网络预设
 * 
 * 包含所有网络相关 API
 * 适用场景：需要网络请求的场景
 */
export const networkPreset = [
  ...basicPreset,
  fetchPlugin,
  xhrPlugin,
  websocketPlugin,
];

/**
 * 完整预设
 * 
 * 包含所有可用插件，提供最完整的浏览器环境
 * 适用场景：复杂的浏览器环境模拟
 */
export const fullPreset = [
  ...minimalPreset,
  eventsPlugin,
  domExceptionPlugin,
  abortPlugin,
  domCorePlugin,
  domCollectionsPlugin,
  domPlugin,
  htmlElementsPlugin,
  htmlPlugin,
  canvasPlugin,
  streamsPlugin,
  timersPlugin,
  storagePlugin,
  fetchPlugin,
  xhrPlugin,
  websocketPlugin,
  messagingPlugin,
  windowPlugin,
  navigatorPlugin,
  locationPlugin,
  historyPlugin,
  performancePlugin,
  encodingPlugin,
  urlPlugin,
  cryptoPlugin,
];

/**
 * 默认预设（使用基础预设）
 */
export const defaultPreset = basicPreset;

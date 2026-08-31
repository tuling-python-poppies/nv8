/**
 * 插件导出入口
 * 
 * 将所有插件从统一入口导出
 */

// Step 1: 核心基础设施
export { webidlPlugin } from "./webidl/index.js";
export { errorsPlugin } from "./errors/index.js";
export { builtinsPlugin } from "./builtins/index.js";
export { consolePlugin } from "./console/index.js";

// Step 2: 事件系统
export { eventsPlugin } from "./events/index.js";
export { abortPlugin } from "./abort/index.js";
export { domExceptionPlugin } from "./dom-exception/index.js";

// Step 3: DOM 核心
export { domCorePlugin } from "./dom-core/index.js";
export { domCollectionsPlugin } from "./dom-collections/index.js";
export { domPlugin } from "./dom/index.js";

// Step 4: HTML 元素
export { htmlPlugin } from "./html/index.js";
export { htmlElementsPlugin } from "./html-elements/index.js";

// Step 5: Web APIs
export { canvasPlugin } from "./canvas/index.js";
export { streamsPlugin } from "./streams/index.js";
export { timersPlugin } from "./timers/index.js";

// Step 6: 存储和网络
export { storagePlugin } from "./storage/index.js";
export { fetchPlugin } from "./fetch/index.js";
export { xhrPlugin } from "./xhr/index.js";
export { websocketPlugin } from "./websocket/index.js";

// Step 7: 浏览器环境
export { windowPlugin } from "./window/index.js";
export { navigatorPlugin } from "./navigator/index.js";
export { locationPlugin } from "./location/index.js";
export { historyPlugin } from "./history/index.js";
export { performancePlugin } from "./performance/index.js";

// Step 8: 编码和安全
export { encodingPlugin } from "./encoding/index.js";
export { urlPlugin } from "./url/index.js";
export { cryptoPlugin } from "./crypto/index.js";
export { messagingPlugin } from "./messaging/index.js";
export { workerPlugin } from "./worker/index.js";
export { workletPlugin } from "./worklet/index.js";
export { serviceWorkerPlugin } from "./service-worker/index.js";

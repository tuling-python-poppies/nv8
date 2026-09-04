/**
 * Built-in Profiles - 内置 Profile 定义
 * 
 * 提供常用的 Profile 配置：
 * 1. minimal - 最小运行时
 * 2. minimal-fetch - 最小 + Fetch
 * 3. dom-replay - DOM + 离线 replay
 * 4. legacy-full - 完整浏览器环境（兼容 legacy bootstrap）
 * 5. browser-edge-v150 - Edge 150 浏览器环境
 */

import { createProfile } from './profile-factory.js';
import {
  webidlPlugin,
  errorsPlugin,
  builtinsPlugin,
  consolePlugin,
  eventsPlugin,
  domExceptionPlugin,
  domCorePlugin,
  domCollectionsPlugin,
  domPlugin,
  htmlPlugin,
  htmlElementsPlugin,
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
  workerPlugin,
  serviceWorkerPlugin,
  workletPlugin,
  abortPlugin,
} from '../../plugins/index.js';

/**
 * Minimal Profile
 * 
 * 最小运行时，只包含 WebIDL 基础和 Console
 * 适用场景：纯 JS 逆向、Node.js 环境补充
 */
export const minimalProfile = createProfile({
  id: 'minimal',
  version: '1.0.0',
  name: 'Minimal Runtime',
  description: 'Minimal JavaScript runtime with WebIDL foundation and console',
  plugins: [
    { id: webidlPlugin.id, range: '>=1.0.0' },
    { id: errorsPlugin.id, range: '>=1.0.0' },
    { id: builtinsPlugin.id, range: '>=1.0.0' },
    { id: consolePlugin.id, range: '>=1.0.0' },
  ],
  nodeSupport: {
    minimum: '18.18.0',
    tested: ['18.18.0', '20.0.0', '22.0.0', '24.11.0'],
  },
});

/**
 * Minimal Fetch Profile
 * 
 * 最小运行时 + Fetch API（离线 replay）
 * 适用场景：简单的 API 签名、token 生成
 */
export const minimalFetchProfile = createProfile({
  id: 'minimal-fetch',
  version: '1.0.0',
  name: 'Minimal with Fetch',
  description: 'Minimal runtime with Fetch API (offline replay only)',
  plugins: [
    { id: webidlPlugin.id, range: '>=1.0.0' },
    { id: errorsPlugin.id, range: '>=1.0.0' },
    { id: builtinsPlugin.id, range: '>=1.0.0' },
    { id: consolePlugin.id, range: '>=1.0.0' },
    { id: eventsPlugin.id, range: '>=1.0.0' },
    { id: domExceptionPlugin.id, range: '>=1.0.0' },
    { id: streamsPlugin.id, range: '>=1.0.0' },
    { id: encodingPlugin.id, range: '>=1.0.0' },
    { id: urlPlugin.id, range: '>=1.0.0' },
    { id: abortPlugin.id, range: '>=1.0.0' },
    { id: fetchPlugin.id, range: '>=1.0.0' },
  ],
  config: {
    fetch: {
      replayOnly: true,
      allowRealNetwork: false,
    },
  },
  nodeSupport: {
    minimum: '18.18.0',
    tested: ['18.18.0', '20.0.0', '22.0.0', '24.11.0'],
  },
});

/**
 * DOM Replay Profile
 * 
 * DOM + Storage + Fetch（离线 replay）
 * 适用场景：需要 DOM 操作的签名算法、页面级 token 生成
 */
export const domReplayProfile = createProfile({
  id: 'dom-replay',
  version: '1.0.0',
  name: 'DOM with Offline Replay',
  description: 'DOM, Storage, and Fetch with offline replay',
  plugins: [
    { id: webidlPlugin.id, range: '>=1.0.0' },
    { id: errorsPlugin.id, range: '>=1.0.0' },
    { id: builtinsPlugin.id, range: '>=1.0.0' },
    { id: consolePlugin.id, range: '>=1.0.0' },
    { id: eventsPlugin.id, range: '>=1.0.0' },
    { id: domExceptionPlugin.id, range: '>=1.0.0' },
    { id: domCorePlugin.id, range: '>=1.0.0' },
    { id: domCollectionsPlugin.id, range: '>=1.0.0' },
    { id: domPlugin.id, range: '>=1.0.0' },
    { id: htmlPlugin.id, range: '>=1.0.0' },
    { id: streamsPlugin.id, range: '>=1.0.0' },
    { id: timersPlugin.id, range: '>=1.0.0' },
    { id: encodingPlugin.id, range: '>=1.0.0' },
    { id: urlPlugin.id, range: '>=1.0.0' },
    { id: storagePlugin.id, range: '>=1.0.0' },
    { id: abortPlugin.id, range: '>=1.0.0' },
    { id: fetchPlugin.id, range: '>=1.0.0' },
    { id: xhrPlugin.id, range: '>=1.0.0' },
  ],
  config: {
    fetch: {
      replayOnly: true,
      allowRealNetwork: false,
    },
    xhr: {
      replayOnly: true,
      allowRealNetwork: false,
    },
  },
  nodeSupport: {
    minimum: '18.18.0',
    tested: ['18.18.0', '20.0.0', '22.0.0', '24.11.0'],
  },
});

/**
 * Legacy Full Profile
 * 
 * 完整浏览器环境，兼容原有的 bootstrap-root.js 行为
 * 适用场景：迁移期间的兼容性保证、复杂的浏览器环境模拟
 */
export const legacyFullProfile = createProfile({
  id: 'legacy-full',
  version: '1.0.0',
  name: 'Legacy Full Browser',
  description: 'Full browser environment compatible with legacy bootstrap',
  experimental: true,
  plugins: [
    // 基础层
    { id: webidlPlugin.id, range: '>=1.0.0' },
    { id: errorsPlugin.id, range: '>=1.0.0' },
    { id: builtinsPlugin.id, range: '>=1.0.0' },
    { id: consolePlugin.id, range: '>=1.0.0' },
    { id: eventsPlugin.id, range: '>=1.0.0' },
    { id: domExceptionPlugin.id, range: '>=1.0.0' },
    
    // DOM 层
    { id: domCorePlugin.id, range: '>=1.0.0' },
    { id: domCollectionsPlugin.id, range: '>=1.0.0' },
    { id: domPlugin.id, range: '>=1.0.0' },
    
    // HTML 层
    { id: htmlPlugin.id, range: '>=1.0.0' },
    { id: htmlElementsPlugin.id, range: '>=1.0.0' },
    { id: canvasPlugin.id, range: '>=1.0.0', optional: true },
    
    // 异步和定时器
    { id: streamsPlugin.id, range: '>=1.0.0' },
    { id: timersPlugin.id, range: '>=1.0.0' },
    
    // 存储
    { id: storagePlugin.id, range: '>=1.0.0' },
    
    // 网络
    { id: abortPlugin.id, range: '>=1.0.0' },
    { id: fetchPlugin.id, range: '>=1.0.0' },
    { id: xhrPlugin.id, range: '>=1.0.0' },
    { id: websocketPlugin.id, range: '>=1.0.0' },
    
    // 浏览器环境
    { id: windowPlugin.id, range: '>=1.0.0' },
    { id: navigatorPlugin.id, range: '>=1.0.0' },
    { id: locationPlugin.id, range: '>=1.0.0' },
    { id: historyPlugin.id, range: '>=1.0.0' },
    { id: performancePlugin.id, range: '>=1.0.0' },
    
    // 编码和加密
    { id: encodingPlugin.id, range: '>=1.0.0' },
    { id: urlPlugin.id, range: '>=1.0.0' },
    { id: cryptoPlugin.id, range: '>=1.0.0' },
    
    // Worker 和消息
    { id: messagingPlugin.id, range: '>=1.0.0' },
    { id: workerPlugin.id, range: '>=1.0.0' },
    { id: serviceWorkerPlugin.id, range: '>=1.0.0' },
    { id: workletPlugin.id, range: '>=1.0.0' },
  ],
  config: {
    legacy: {
      compatibilityMode: true,
      bootstrapBehavior: 'preserve',
    },
    fetch: {
      replayOnly: true,
      allowRealNetwork: false,
    },
    websocket: {
      replayOnly: true,
      allowRealNetwork: false,
    },
  },
  nodeSupport: {
    minimum: '18.18.0',
    tested: ['24.11.0'],
    limitations: {
      '18.x': 'Some modern APIs may have degraded behavior',
      '20.x': 'Async module loading may be slower',
    },
  },
  degradations: [
    {
      capability: 'canvas.webgl',
      behavior: 'WebGL context creation returns null',
      reason: 'No native OpenGL binding available',
    },
    {
      capability: 'media.codecs',
      behavior: 'Media codec APIs not available',
      reason: 'No native codec support',
    },
  ],
});

/**
 * Browser Profile for Edge v150
 * 
 * 模拟 Microsoft Edge 150 的浏览器环境
 * 适用场景：需要特定浏览器指纹的场景
 */
export const browserProfileForEdgeVersion150 = createProfile({
  id: 'browser-profile-edge-v150',
  version: '1.0.0',
  name: 'Microsoft Edge 150',
  description: 'Browser environment for Microsoft Edge version 150',
  metadata: {
    browserFamily: 'edge',
    browserVersion: 150,
    platform: 'windows',
  },
  plugins: [
    // 与 legacy-full 相同的插件列表
    { id: webidlPlugin.id, range: '>=1.0.0' },
    { id: errorsPlugin.id, range: '>=1.0.0' },
    { id: builtinsPlugin.id, range: '>=1.0.0' },
    { id: consolePlugin.id, range: '>=1.0.0' },
    { id: eventsPlugin.id, range: '>=1.0.0' },
    { id: domExceptionPlugin.id, range: '>=1.0.0' },
    { id: domCorePlugin.id, range: '>=1.0.0' },
    { id: domCollectionsPlugin.id, range: '>=1.0.0' },
    { id: domPlugin.id, range: '>=1.0.0' },
    { id: htmlPlugin.id, range: '>=1.0.0' },
    { id: htmlElementsPlugin.id, range: '>=1.0.0' },
    { id: canvasPlugin.id, range: '>=1.0.0', optional: true },
    { id: streamsPlugin.id, range: '>=1.0.0' },
    { id: timersPlugin.id, range: '>=1.0.0' },
    { id: storagePlugin.id, range: '>=1.0.0' },
    { id: abortPlugin.id, range: '>=1.0.0' },
    { id: fetchPlugin.id, range: '>=1.0.0' },
    { id: xhrPlugin.id, range: '>=1.0.0' },
    { id: websocketPlugin.id, range: '>=1.0.0' },
    { id: windowPlugin.id, range: '>=1.0.0' },
    { id: navigatorPlugin.id, range: '>=1.0.0' },
    { id: locationPlugin.id, range: '>=1.0.0' },
    { id: historyPlugin.id, range: '>=1.0.0' },
    { id: performancePlugin.id, range: '>=1.0.0' },
    { id: encodingPlugin.id, range: '>=1.0.0' },
    { id: urlPlugin.id, range: '>=1.0.0' },
    { id: cryptoPlugin.id, range: '>=1.0.0' },
    { id: messagingPlugin.id, range: '>=1.0.0' },
    { id: workerPlugin.id, range: '>=1.0.0' },
    { id: serviceWorkerPlugin.id, range: '>=1.0.0' },
    { id: workletPlugin.id, range: '>=1.0.0' },
  ],
  config: {
    navigator: {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0',
      appVersion: '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0',
      platform: 'Win32',
      vendor: 'Google Inc.',
      product: 'Gecko',
      productSub: '20030107',
      language: 'en-US',
      languages: ['en-US', 'en'],
    },
    screen: {
      width: 1920,
      height: 1080,
      availWidth: 1920,
      availHeight: 1040,
      colorDepth: 24,
      pixelDepth: 24,
    },
    fetch: {
      replayOnly: true,
      allowRealNetwork: false,
    },
  },
  nodeSupport: {
    minimum: '18.18.0',
    tested: ['20.0.0', '22.0.0', '24.11.0'],
  },
});

/**
 * 注册所有内置 Profile 到全局注册表
 * 这样 profile-factory.js 可以同步访问它们，避免循环依赖
 */
if (!globalThis.__NV8_PROFILE_REGISTRY__) {
  globalThis.__NV8_PROFILE_REGISTRY__ = {};
}

globalThis.__NV8_PROFILE_REGISTRY__['minimal'] = minimalProfile;
globalThis.__NV8_PROFILE_REGISTRY__['minimal-fetch'] = minimalFetchProfile;
globalThis.__NV8_PROFILE_REGISTRY__['dom-replay'] = domReplayProfile;
globalThis.__NV8_PROFILE_REGISTRY__['legacy-full'] = legacyFullProfile;
globalThis.__NV8_PROFILE_REGISTRY__['browser-profile-edge-v150'] = browserProfileForEdgeVersion150;

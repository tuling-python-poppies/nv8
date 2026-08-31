/**
 * Legacy Bootstrap Adapter
 * 
 * 包装现有的 bootstrap-root.js，提供过渡期间的兼容性层。
 * 允许在新插件系统就绪之前继续使用旧的 bootstrap 逻辑。
 * 
 * 使用场景：
 * - 渐进式迁移：先建立插件基础设施，再逐步迁移功能
 * - 双轨运行：新旧系统并行，通过配置切换
 * - 行为验证：对比新旧系统的行为差异
 */

import {
  bootstrapRoot,
  enableProxyTrace,
  disableProxyTrace,
  clearProxyTrace,
  proxyTrace,
  observeEvaluationPromise,
  readEvaluationPromise,
  nextScheduledTaskDelay,
  runScheduledTasks,
  clearScheduledTasks,
  markWindowClosed,
  resetWindowPage,
  exportLocalStorage,
  exportSessionStorage,
  exportCookies,
  receiveParentMessage,
} from '../../bootstrap/bootstrap-root.js';

/**
 * 创建 Legacy Bootstrap 适配器
 * 
 * @param {object} options - Bootstrap 配置选项
 * @returns {object} 适配器实例，提供旧 API
 */
export function createLegacyBootstrapAdapter(options = {}) {
  // 解构所有 bootstrap 参数
  const {
    // Trace 配置
    traceEnabled = false,
    maxTraceEntries = 100_000,
    
    // Screen 配置
    screenWidth = 1920,
    screenHeight = 1080,
    screenAvailWidth = 1920,
    screenAvailHeight = 1040,
    screenColorDepth = 24,
    screenPixelDepth = 24,
    screenDevicePixelRatio = 1,
    screenAvailLeft = 0,
    screenAvailTop = 0,
    screenIsExtended = false,
    
    // Navigation 配置
    pageUrl = 'https://localhost/',
    pageHtml = '',
    pageReferrer = '',
    pageContentType = 'text/html',
    
    // Navigator 配置
    navigatorUserAgent = 'Mozilla/5.0 Chrome/150.0.0.0 Safari/537.36',
    navigatorPlatform = 'Win32',
    navigatorLanguages = '5:en-US2:en',
    navigatorLanguage = 'en-US',
    navigatorHardwareConcurrency = 8,
    navigatorDeviceMemory = 8,
    
    // Storage 配置
    localStorageData = '',
    sessionStorageData = '',
    cookieData = '',
    
    // Fetch Replay 配置
    replay = [],
    networkRequestRecorder = null,
    
    // Realm 配置
    childRealmFactory = null,
    parentWindow = null,
    topWindow = null,
    parentOrigin = '',
    parentPostMessage = null,
    parentSameOrigin = false,
    outerWindow = null,
    
    // Worker 配置
    workerFactory = null,
    sharedWorkerFactory = null,
    serviceWorkerFactory = null,
    workletFactory = null,
    
    // Messaging 配置
    broadcastConnector = null,
    
    // Profile 配置
    renderingProfile = null,
    capabilitiesProfile = null,
    nativeFunctionRegistry = null,
    objectURLRegistry = null,
    browserMajorVersion = 150,
    timingProfile = null,
    navigatorMetadata = null,
  } = options;
  
  // 调用旧的 bootstrap 函数
  bootstrapRoot(
    traceEnabled,
    maxTraceEntries,
    screenWidth,
    screenHeight,
    screenAvailWidth,
    screenAvailHeight,
    screenColorDepth,
    screenPixelDepth,
    screenDevicePixelRatio,
    screenAvailLeft,
    screenAvailTop,
    screenIsExtended,
    pageUrl,
    navigatorUserAgent,
    navigatorPlatform,
    navigatorLanguages,
    navigatorLanguage,
    navigatorHardwareConcurrency,
    navigatorDeviceMemory,
    localStorageData,
    sessionStorageData,
    cookieData,
    pageHtml,
    pageReferrer,
    pageContentType,
    replay,
    networkRequestRecorder,
    childRealmFactory,
    parentWindow,
    topWindow,
    parentOrigin,
    parentPostMessage,
    parentSameOrigin,
    outerWindow,
    workerFactory,
    sharedWorkerFactory,
    serviceWorkerFactory,
    workletFactory,
    broadcastConnector,
    renderingProfile,
    capabilitiesProfile,
    nativeFunctionRegistry,
    objectURLRegistry,
    browserMajorVersion,
    timingProfile,
    navigatorMetadata,
  );
  
  // 返回适配器实例，暴露旧的 API
  return {
    // Trace API
    enableTrace: enableProxyTrace,
    disableTrace: disableProxyTrace,
    clearTrace: clearProxyTrace,
    getTrace: proxyTrace,
    
    // Promise Observer API
    observePromise: observeEvaluationPromise,
    readPromiseObserver: readEvaluationPromise,
    
    // Scheduler API
    nextTimerDelay: nextScheduledTaskDelay,
    runTimers: runScheduledTasks,
    clearTimers: clearScheduledTasks,
    
    // Window Lifecycle API
    closeWindow: markWindowClosed,
    resetPage: resetWindowPage,
    
    // Storage Export API
    exportLocalStorage,
    exportSessionStorage,
    exportCookies,
    
    // Messaging API
    receiveParentMessage,
    
    // Metadata
    isLegacy: true,
    bootstrapVersion: 'legacy',
  };
}

/**
 * 从新插件系统选项转换到旧 bootstrap 参数
 * 
 * @param {object} pluginOptions - 插件系统选项
 * @returns {object} Bootstrap 参数
 */
export function convertToLegacyOptions(pluginOptions) {
  // 这个函数会在插件系统和 legacy 系统之间做选项转换
  // 目前先返回原始选项
  return pluginOptions;
}

/**
 * 检查是否应该使用 Legacy 模式
 * 
 * @param {object} options - 配置选项
 * @returns {boolean}
 */
export function shouldUseLegacy(options = {}) {
  // 检查显式配置
  if (typeof options.useLegacy === 'boolean') {
    return options.useLegacy;
  }
  
  // 检查环境变量
  if (typeof process !== 'undefined' && process.env) {
    if (process.env.NV8_USE_LEGACY === '1' || process.env.NV8_USE_LEGACY === 'true') {
      return true;
    }
    if (process.env.NV8_USE_LEGACY === '0' || process.env.NV8_USE_LEGACY === 'false') {
      return false;
    }
  }
  
  // 默认使用 legacy（在迁移完成前）
  return true;
}

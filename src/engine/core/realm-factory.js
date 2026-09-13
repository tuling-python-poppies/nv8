/**
 * Realm Factory - 创建和管理 Realm
 * 
 * Realm 是代码执行的隔离环境，每个 Realm 有自己的：
 * 1. 全局对象（globalThis）
 * 2. 内置对象原型链
 * 3. 插件注入的 API
 * 4. 独立的状态
 * 
 * Realm 类型：
 * - root: 主 window/全局环境
 * - worker: Web Worker
 * - iframe: iframe 窗口
 * - worklet: Worklet (Paint/Audio/Animation)
 */

import vm from 'node:vm';
import { RealmModuleLoader } from '../realm/module-loader.js';
import {
  createParserScriptExecutor,
  executePageScripts,
} from './page-script-runner.js';
import {
  collectGlobalSurfaceMap,
  createCapabilityExplainer,
  installStrictCapabilityDiagnostics,
} from './capability-diagnostics.js';

/**
 * 全局表面映射的进程级缓存。
 *
 * 映射表由静态解析插件源码得出，对同一组插件结果恒定。每创建一个
 * Realm 就重新读一遍所有插件文件会把 Realm 创建变成 IO 密集操作。
 *
 * 缓存键用插件 id 排序后的拼接，而不是插件数组引用——同一组插件可能
 * 以不同数组实例传入。
 */
const surfaceMapCache = new Map();

/**
 * 构建缺失能力诊断（ADR-0002，已按实测修订）。
 *
 * ## 为什么 explainer 是惰性的
 *
 * 最初把诊断构建写成 Realm 创建流程里的 `await`。结果 async 页面脚本的
 * 执行时序被改变：`await import('../../config/presets/index.js')` 加上读 28 个插件
 * 文件的 IO 在流程末尾插入了显著延迟，async 脚本在这期间就跑完了，
 * 状态仍是 `loading` 而非 `interactive`，`page-script-lifecycle` 测试
 * 稳定失败。
 *
 * 诊断是**出错后**才需要的辅助设施，没有理由让它拖慢每个 Realm 的创建。
 * 因此默认模式改为惰性：首次访问 `realm.capabilityExplainer` 才构建。
 *
 * strict 模式必须在脚本运行前装好 getter，无法惰性化。它是显式开启的调试
 * 模式，那点延迟可以接受。
 *
 * @param {object} options
 * @returns {Promise<Map<string, object>>}
 */
async function resolveSurfaceMap(options) {
  const { loadedPlugins, candidatePlugins } = options;

  // 未指定候选集时回退到内置全量预设：否则只能诊断「已装载插件声明但
  // 未生效」的全局，而那恰好是最无用的一部分。
  let candidates = candidatePlugins;
  if (candidates === null || candidates === undefined) {
    const presets = await import('../../config/presets/index.js');
    candidates = presets.fullPreset ?? loadedPlugins;
  }

  const cacheKey = candidates.map((plugin) => plugin?.id ?? '?').sort().join('|');
  let surfaceMap = surfaceMapCache.get(cacheKey);
  if (surfaceMap === undefined) {
    surfaceMap = await collectGlobalSurfaceMap(candidates);
    surfaceMapCache.set(cacheKey, surfaceMap);
  }
  return surfaceMap;
}

/**
 * 创建惰性 explainer 句柄。
 *
 * 返回对象的方法都是 async——构建被推迟到首次调用。
 *
 * @param {object} options
 * @returns {Readonly<object>}
 */
function createLazyExplainer(options) {
  const { context, loadedPlugins, candidatePlugins, logger, realmId } = options;
  let cached = null;
  let failed = false;

  async function resolve() {
    if (cached !== null || failed) return cached;
    try {
      const surfaceMap = await resolveSurfaceMap({ loadedPlugins, candidatePlugins });
      cached = createCapabilityExplainer({
        surfaceMap,
        loadedCapabilities: loadedPlugins.flatMap((plugin) => plugin.capabilities ?? []),
        isLoaded: (name) => name in context,
      });
    } catch (error) {
      // 诊断是辅助设施，它失败不应向上冒泡成业务错误
      failed = true;
      logger.warn(
        `[Realm ${realmId}] Capability diagnostics unavailable: ${error.message}`
      );
    }
    return cached;
  }

  return Object.freeze({
    /** 解释某个全局为何不可用 */
    async explain(globalName) {
      return (await resolve())?.explain(globalName) ?? null;
    },
    /** 把 ReferenceError 转成结构化诊断 */
    async diagnose(error) {
      return (await resolve())?.diagnose(error) ?? null;
    },
    /** 反推应加载的插件 */
    async suggest(globalNames) {
      return (await resolve())?.suggest(globalNames)
        ?? { plugins: [], capabilities: [], unknown: [...(globalNames ?? [])] };
    },
  });
}

let realmIdCounter = 0;
const PAGE_PARSER_URL = new URL(
  '../../surface/api/dom/html-parser.js',
  import.meta.url,
);
const CORE_NAVIGATION_URL = new URL(
  '../../surface/install/install-core-navigation.js',
  import.meta.url,
);
const FETCH_INSTALLER_URL = new URL(
  '../../surface/install/install-fetch.js',
  import.meta.url,
);
const NAVIGATOR_INSTALLER_URL = new URL(
  '../../surface/install/install-navigator.js',
  import.meta.url,
);
const PERFORMANCE_INSTALLER_URL = new URL(
  '../../surface/install/install-performance.js',
  import.meta.url,
);
const PAGE_LIFECYCLE_URL = new URL(
  '../../surface/install/install-page-lifecycle.js',
  import.meta.url,
);
const WINDOW_CONTEXT_URL = new URL(
  '../../surface/install/install-window-context.js',
  import.meta.url,
);
const SERVICE_WORKER_RUNTIME_URL = new URL(
  '../../surface/api/worker/service-worker-runtime.js',
  import.meta.url,
);
const WORKER_GLOBAL_RUNTIME_URL = new URL(
  '../../surface/api/worker/worker-global-runtime.js',
  import.meta.url,
);

/**
 * 同步回调会用到的模块。
 *
 * 这些模块必须在 Realm 创建阶段预先求值，因为引用它们的调用点
 * （controllerchange 广播、postMessage 派送、页面生命周期钩子）无法改成
 * 异步：调用方依赖它们的同步语义。
 */
const SYNC_CALLBACK_MODULE_URLS = Object.freeze([
  PAGE_LIFECYCLE_URL,
  WINDOW_CONTEXT_URL,
  SERVICE_WORKER_RUNTIME_URL,
  WORKER_GLOBAL_RUNTIME_URL,
]);

/**
 * 创建 Realm
 * 
 * @param {RealmConfig} config
 * @returns {Promise<Realm>}
 */
export async function createRealm(config) {
  const {
    sandboxId,
    type = 'root',
    plugins,
    stateRegistry,
    globals,
    trace,
    logger,
    pageUrl = 'https://example.com/',
    origin = null,
    pageHtml = '<!doctype html><html><head></head><body></body></html>',
    replay = [],
    navigatorProfile = {},
    timingProfile = null,
    runtime = {},
    limits = {},
  } = config;
  
  const realmId = `${sandboxId}-realm-${++realmIdCounter}`;
  
  logger.info(`[Realm ${realmId}] Creating realm of type: ${type}`);
  
  // 1. 创建 vm.Context
  const page = new URL(pageUrl);
  const realmOrigin = origin ?? page.origin;
  const context = vm.createContext({}, {
    name: realmId,
    origin: realmOrigin,
    codeGeneration: {
      strings: true,
      wasm: true,
    },
  });
  const moduleLoader = new RealmModuleLoader(context);

  // 预加载同步回调依赖的模块。
  // Node 18–22 无法同步链接，但 ServiceWorker controllerchange、
  // postMessage 派送等回调必须保持同步语义，因此在这里（异步上下文）
  // 先把它们求值完，回调内只需查缓存。
  await moduleLoader.preload(SYNC_CALLBACK_MODULE_URLS);
  
  // 2. 初始化基础全局对象
  initializeBaseGlobals(context, realmId, logger);
  if (runtime.windowContext) {
    const windowContextModule = await moduleLoader.importUrlAsync(WINDOW_CONTEXT_URL);
    if (!windowContextModule?.namespace?.installWindowContext) {
      throw new Error('Realm module loader cannot install window context');
    }
    windowContextModule.namespace.installWindowContext(runtime.windowContext);
  }

  // Navigation state must exist before any Location, History, or DOM
  // installer reads the current URL.
  const navigationModule = await moduleLoader.importUrlAsync(CORE_NAVIGATION_URL);
  if (!navigationModule?.namespace?.installCoreNavigation) {
    throw new Error('Realm module loader cannot install navigation state');
  }
  navigationModule.namespace.installCoreNavigation(page.href, {
    origin: realmOrigin,
    beforeNavigate: runtime.beforeNavigate,
    onNavigate: runtime.onNavigate,
  });
  
  const hasPerformancePlugin = plugins.some(plugin => (
    plugin.id === '@nv8/plugin-performance'
    || (plugin.provides || plugin.capabilities || []).some(capability => (
      (typeof capability === 'string' ? capability : capability.name) === 'performance.base'
    ))
  ));
  if (hasPerformancePlugin) {
    const performanceModule = await moduleLoader.importUrlAsync(PERFORMANCE_INSTALLER_URL);
    if (!performanceModule?.namespace?.configureTimingProfile) {
      throw new Error('Realm module loader cannot configure Performance timing');
    }
    performanceModule.namespace.configureTimingProfile(timingProfile);
  }

  const hasNavigatorPlugin = plugins.some(plugin => (
    plugin.id === '@nv8/plugin-navigator'
    || (plugin.provides || plugin.capabilities || []).some(capability => (
      (typeof capability === 'string' ? capability : capability.name) === 'navigator.base'
    ))
  ));
  if (hasNavigatorPlugin) {
    const navigatorModule = await moduleLoader.importUrlAsync(NAVIGATOR_INSTALLER_URL);
    if (!navigatorModule?.namespace?.configureNavigatorProfile) {
      throw new Error('Realm module loader cannot configure Navigator');
    }
    const navigatorConfig = navigatorProfile || {};
    const language = `${navigatorConfig.language ?? 'en-US'}`;
    const languages = Array.isArray(navigatorConfig.languages)
      ? navigatorConfig.languages
      : [language];
    navigatorModule.namespace.configureGPUProfile(navigatorConfig.rendering);
    navigatorModule.namespace.configureNavigatorProfile(
      `${navigatorConfig.userAgent ?? 'Mozilla/5.0 Chrome/150.0.0.0 Safari/537.36'}`,
      `${navigatorConfig.platform ?? 'Win32'}`,
      encodeNavigatorLanguages(languages),
      language,
      Number(navigatorConfig.hardwareConcurrency ?? 8),
      Number(navigatorConfig.deviceMemory ?? 8),
      navigatorConfig.capabilities ?? null,
      navigatorConfig.metadata ?? navigatorConfig,
    );
  }

  // 3. 激活所有插件
  for (const plugin of plugins) {
    if (!plugin._installed) {
      logger.warn(`[Realm ${realmId}] Plugin not installed: ${plugin.id}`);
      continue;
    }
    
    // 检查插件是否支持此 Realm 类型
    const supportedRealms = plugin.manifest?.realms
      || plugin.supports?.realms
      || ['root'];
    if (!supportedRealms.includes(type) && !supportedRealms.includes('*')) {
      if (trace) {
        logger.info(`[Realm ${realmId}] Skipping plugin ${plugin.id} (not compatible with ${type})`);
      }
      continue;
    }
    
    if (trace) {
      logger.info(`[Realm ${realmId}] Activating plugin: ${plugin.id}`);
    }
    
    try {
      await activatePlugin(
        plugin,
        context,
        sandboxId,
        realmId,
        stateRegistry,
        globals,
        logger,
        trace,
        type,
        moduleLoader,
        page.href,
        pageHtml,
        runtime,
      );
    } catch (error) {
      logger.error(`[Realm ${realmId}] Plugin activation failed:`, error);
      throw new Error(
        `Failed to activate plugin "${plugin.id}" in realm "${realmId}": ${error.message}`
      );
    }
  }

  const hasFetchPlugin = plugins.some(plugin => (
    plugin.id === '@nv8/plugin-fetch'
    || (plugin.provides || plugin.capabilities || []).some(capability => (
      (typeof capability === 'string' ? capability : capability.name) === 'fetch.base'
    ))
  ));
  if (hasFetchPlugin && replay.length > 0) {
    const fetchModule = await moduleLoader.importUrlAsync(FETCH_INSTALLER_URL);
    if (!fetchModule?.namespace?.configureFetchReplay) {
      throw new Error('Realm module loader cannot configure Fetch replay');
    }
    fetchModule.namespace.configureFetchReplay(
      replay,
      runtime.networkRequestRecorder ?? null,
      {
        ...runtime.fetchReplayOptions,
        serviceWorkerFetch: runtime.serviceWorkerFetch ?? null,
      },
    );
  }

  const hasDocumentPlugin = plugins.some(plugin => {
    const provides = plugin.manifest?.provides || plugin.provides || [];
    return provides.some(capability => (
      typeof capability === 'string'
        ? capability === 'dom.document'
        : capability.name === 'dom.document' || capability.id === 'dom.document'
    ));
  });
  let lifecycleModule = null;
  if (hasDocumentPlugin) {
    lifecycleModule = await moduleLoader.importUrlAsync(PAGE_LIFECYCLE_URL);
    if (!lifecycleModule?.namespace?.setPageLoading) {
      throw new Error('Realm module loader cannot install page lifecycle');
    }
    lifecycleModule.namespace.setPageLoading();

    // window 的 EventTarget 方法必须在**任何页面脚本执行前**就绪。
    //
    // 迁移前它由 executePageScripts() 首行安装，但 parser 阶段的 inline
    // 脚本在 HTML 解析过程中就执行了，那时 executePageScripts 还没被调用。
    // 结果 `window.addEventListener('DOMContentLoaded', ...)` 这类最常见的
    // 页面就绪写法在 inline 脚本里直接抛 TypeError（addEventListener
    // 是 undefined），脚本从那一行中断。
    //
    // 浏览器里 window.addEventListener 从一开始就可用，因此提前到这里。
    lifecycleModule.namespace.ensureDocumentEventTargetForPage?.();
  }
  let pageScriptAsyncComplete = Promise.resolve();
  let pageScriptObserver = null;
  let pageScriptDispose = null;
  const parserExecutedScripts = new WeakSet();
  if (hasDocumentPlugin && pageHtml !== '') {
    const parserModule = await moduleLoader.importUrlAsync(PAGE_PARSER_URL);
    if (!parserModule?.namespace?.parsePageHTML) {
      throw new Error('Realm module loader cannot install page parser');
    }
    lifecycleModule.namespace.setDocumentParserScriptExecutorForPage?.(
      createParserScriptExecutor({
        context,
        pageUrl,
        replay,
        lifecycleModule,
        scriptPolicy: runtime.scriptPolicy,
        executedScripts: parserExecutedScripts,
      }),
    );
    parserModule.namespace.parsePageHTML(pageHtml);
    const pageScripts = await executePageScripts({
      context,
      document: context.document,
      pageUrl,
      replay,
      lifecycleModule,
      scriptPolicy: runtime.scriptPolicy,
      executedScripts: parserExecutedScripts,
    });
    pageScriptAsyncComplete = pageScripts.asyncComplete;
    pageScriptObserver = pageScripts.observer;
    pageScriptDispose = pageScripts.dispose;
    lifecycleModule.namespace.setDocumentPageReload?.(async document => {
      pageScriptDispose?.();
      pageScriptDispose = null;
      const nextScripts = await executePageScripts({
        context,
        document,
        pageUrl,
        replay,
        lifecycleModule,
        scriptPolicy: runtime.scriptPolicy,
        executedScripts: parserExecutedScripts,
      });
      pageScriptAsyncComplete = nextScripts.asyncComplete;
      pageScriptObserver?.disconnect?.();
      pageScriptObserver = nextScripts.observer;
      pageScriptDispose = nextScripts.dispose;
      lifecycleModule.namespace.setPageInteractive?.();
      lifecycleModule.namespace.dispatchDOMContentLoaded?.();
      await pageScriptAsyncComplete;
      lifecycleModule.namespace.dispatchLoad?.();
    });
  }
  
  // 缺失能力诊断放在 Realm 构建**完全结束后**（ADR-0002）。
  //
  // 位置很关键：最初放在插件激活之后，结果 createRealm 自身的后续步骤
  // （DOM 构建、页面生命周期）会用取值方式探测 `document` 是否存在，
  // 直接触发诊断并让 Realm 创建失败。
  //
  // 诊断是给**目标脚本**用的，不应干扰 Core 自身的构建流程。
  const diagnosticMode = runtime.capabilityDiagnostics ?? 'explain';
  const diagnosticsEnabled = diagnosticMode !== false && diagnosticMode !== 'off';

  // 惰性 explainer：不在创建流程里做 IO，避免改变页面脚本时序
  const capabilityExplainer = diagnosticsEnabled
    ? createLazyExplainer({
      context,
      loadedPlugins: plugins,
      candidatePlugins: runtime.diagnosticPlugins ?? null,
      logger,
      realmId,
    })
    : null;

  // strict 模式必须在脚本运行前装好 getter，无法惰性化
  let strictDiagnosticGlobals = Object.freeze([]);
  if (diagnosticMode === 'strict') {
    try {
      const surfaceMap = await resolveSurfaceMap({
        loadedPlugins: plugins,
        candidatePlugins: runtime.diagnosticPlugins ?? null,
      });
      strictDiagnosticGlobals = Object.freeze(installStrictCapabilityDiagnostics({
        evaluate: source => vm.runInContext(source, context),
        surfaceMap,
        loadedCapabilities: plugins.flatMap(plugin => plugin.capabilities ?? []),
      }));
    } catch (error) {
      logger.warn(
        `[Realm ${realmId}] Strict capability diagnostics unavailable: ${error.message}`
      );
    }
  }

  logger.info(`[Realm ${realmId}] Realm created successfully`);
  
  return {
    id: realmId,
    type,
    sandboxId,
    moduleLoader,
    pageScriptAsyncComplete,
    pageScriptObserver,
    disposePageScripts() {
      pageScriptDispose?.();
      pageScriptDispose = null;
    },
    // 缺失能力诊断查询器（ADR-0002）。默认不修改全局，通过 API 提供建议。
    capabilityExplainer,
    // strict 模式下安装了抛错 getter 的全局名；默认模式为空数组。
    strictDiagnosticGlobals,
    
    /**
     * 获取全局对象
     */
    get global() {
      return context;
    },
    
    // Alias used by script injectors and browser-style callers.
    get globalThis() {
      return context;
    },
    
    /**
     * 执行代码
     * 
     * @param {string} code - 要执行的代码
     * @param {EvalOptions} options - 执行选项
     * @returns {any}
     */
    evaluate(code, options = {}) {
      const {
        filename = '<eval>',
        timeout = limits.timeoutMs ?? 5000,
        displayErrors = true,
      } = options;
      
      try {
        if (typeof code !== 'string') {
          throw new TypeError('Realm evaluation source must be a string');
        }
        return vm.runInContext(code, context, {
          filename,
          timeout,
          displayErrors,
        });
      } catch (error) {
        logger.error(`[Realm ${realmId}] Evaluation error:`, error);
        throw error;
      }
    },
    
    /**
     * 获取 Realm 状态
     */
    getState(key) {
      return stateRegistry.get(key, 'realm', realmId);
    },
    
    /**
     * 设置 Realm 状态
     */
    setState(key, value) {
      stateRegistry.set(key, value, 'realm', realmId);
    },
    
    /**
     * 重置 Realm
     * 
     * 调用所有插件的 reset 钩子
     */
    async reset() {
      logger.info(`[Realm ${realmId}] Resetting realm`);
      
      for (const plugin of plugins) {
        if (plugin.reset) {
          try {
            const pluginContext = createPluginContext(
              plugin,
              context,
              sandboxId,
              realmId,
              stateRegistry,
              globals,
              logger,
              trace,
              type,
              moduleLoader,
            );
            await plugin.reset(pluginContext);
          } catch (error) {
            logger.error(`[Realm ${realmId}] Plugin reset failed:`, error);
          }
        }
      }
      
      logger.info(`[Realm ${realmId}] Realm reset complete`);
    },
    
    /**
     * 销毁 Realm
     * 
     * 清理所有资源和状态
     */
    async destroy() {
      pageScriptObserver?.disconnect?.();
      pageScriptObserver = null;
      pageScriptDispose?.();
      pageScriptDispose = null;
      logger.info(`[Realm ${realmId}] Destroying realm`);
      
      // 调用所有插件的 dispose 钩子
      for (const plugin of plugins) {
        if (plugin.dispose) {
          try {
            const pluginContext = createPluginContext(
              plugin,
              context,
              sandboxId,
              realmId,
              stateRegistry,
              globals,
              logger,
              trace,
              type,
              moduleLoader,
            );
            await plugin.dispose(pluginContext);
          } catch (error) {
            logger.error(`[Realm ${realmId}] Plugin dispose failed:`, error);
          }
        }
      }
      
      logger.info(`[Realm ${realmId}] Realm destroyed`);
    },
    
    // Compatibility alias for callers that use dispose semantics.
    async dispose() {
      return this.destroy();
    },
    
    /**
     * 调试信息
     */
    inspect() {
      return {
        id: realmId,
        type,
        sandboxId,
        plugins: plugins.map(p => `${p.id}@${p.version}`),
      };
    },
  };
}

/**
 * 初始化基础全局对象
 * 
 * 将 Node.js 的内置对象注入到 vm.Context
 */
function encodeNavigatorLanguages(languages) {
  return languages.map(language => `${language}`)
    .map(language => `${language.length}:${language}`)
    .join('');
}

function initializeBaseGlobals(context, realmId, logger) {
  // Host scheduling primitives are required for browser-like async callbacks.
  context.setTimeout = setTimeout;
  context.clearTimeout = clearTimeout;
  context.setInterval = setInterval;
  context.clearInterval = clearInterval;
  context.queueMicrotask = queueMicrotask;
  
  // 基础类型和构造函数
  context.Object = Object;
  context.Function = Function;
  context.Array = Array;
  context.String = String;
  context.Number = Number;
  context.Boolean = Boolean;
  context.Symbol = Symbol;
  context.BigInt = BigInt;
  context.Date = Date;
  context.URL = URL;
  context.URLSearchParams = URLSearchParams;
  context.TextEncoder = TextEncoder;
  context.TextDecoder = TextDecoder;
  context.RegExp = RegExp;
  context.Error = Error;
  context.EvalError = EvalError;
  context.RangeError = RangeError;
  context.ReferenceError = ReferenceError;
  context.SyntaxError = SyntaxError;
  context.TypeError = TypeError;
  context.URIError = URIError;
  context.AggregateError = AggregateError;
  
  // 集合类型
  context.Map = Map;
  context.Set = Set;
  context.WeakMap = WeakMap;
  context.WeakSet = WeakSet;
  
  // 类型化数组
  context.ArrayBuffer = ArrayBuffer;
  context.SharedArrayBuffer = SharedArrayBuffer;
  context.DataView = DataView;
  context.Int8Array = Int8Array;
  context.Uint8Array = Uint8Array;
  context.Uint8ClampedArray = Uint8ClampedArray;
  context.Int16Array = Int16Array;
  context.Uint16Array = Uint16Array;
  context.Int32Array = Int32Array;
  context.Uint32Array = Uint32Array;
  context.Float32Array = Float32Array;
  context.Float64Array = Float64Array;
  context.BigInt64Array = BigInt64Array;
  context.BigUint64Array = BigUint64Array;
  
  // Promise 和异步
  context.Promise = Promise;
  context.console = console;
  
  // 代理和反射
  context.Proxy = Proxy;
  context.Reflect = Reflect;
  
  // JSON
  context.JSON = JSON;
  
  // Math
  context.Math = Math;
  
  // 全局函数
  context.parseInt = parseInt;
  context.parseFloat = parseFloat;
  context.isNaN = isNaN;
  context.isFinite = isFinite;
  context.decodeURI = decodeURI;
  context.decodeURIComponent = decodeURIComponent;
  context.encodeURI = encodeURI;
  context.encodeURIComponent = encodeURIComponent;
  context.escape = escape;
  context.unescape = unescape;
  
  // 全局变量
  context.undefined = undefined;
  context.NaN = NaN;
  context.Infinity = Infinity;
  
  // globalThis 指向自己
  context.globalThis = context;
  
  // 使 context 看起来像浏览器全局对象
  context.self = context;
  context.global = context; // Node.js 兼容
}

/**
 * 激活插件
 * 
 * 调用插件的 activate 钩子，在 Realm 中注入 API
 */
async function activatePlugin(
  plugin,
  context,
  sandboxId,
  realmId,
  stateRegistry,
  globals,
  logger,
  trace,
  type,
  moduleLoader,
  pageUrl,
  pageHtml,
  runtime = {},
) {
  if (!plugin.activate) {
    return; // 插件没有 activate 钩子
  }
  
  const pluginContext = createPluginContext(
    plugin,
    context,
    sandboxId,
    realmId,
    stateRegistry,
    globals,
    logger,
    trace,
    type,
    moduleLoader,
    pageUrl,
    pageHtml,
    runtime,
  );
  
  await plugin.activate(pluginContext);
}

/**
 * 创建插件上下文
 * 
 * 这是传递给插件 activate/reset/dispose 钩子的上下文对象
 */
function createPluginContext(
  plugin,
  vmContext,
  sandboxId,
  realmId,
  stateRegistry,
  globals,
  logger,
  trace,
  realmType = 'root',
  moduleLoader = null,
  pageUrl = 'https://example.com/',
  pageHtml = '',
  runtime = {},
) {
  const pluginInstanceId = `${plugin.id}@${plugin.version}#${sandboxId}#${realmId}`;
  
  return {
    // 插件信息
    plugin: {
      id: plugin.id,
      version: plugin.version,
      provides: plugin.manifest?.provides || plugin.provides || [],
      requires: plugin.manifest?.requires || plugin.requires || [],
    },
    
    // Realm 全局对象
    global: vmContext,
    realm: {
      id: realmId,
      type: realmType,
      global: vmContext,
    },
    sandboxId,
    moduleLoader,
    pageUrl,
    pageHtml,
    runtime,
    
    // 状态管理（简化版，直接访问 StateRegistry）
    state: {
      get(key) {
        return stateRegistry.get(`${plugin.id}.${key}`, 'realm', realmId);
      },
      set(key, value) {
        stateRegistry.set(`${plugin.id}.${key}`, value, 'realm', realmId);
      },
      has(key) {
        return stateRegistry.has(`${plugin.id}.${key}`, 'realm', realmId);
      },
      delete(key) {
        stateRegistry.delete(`${plugin.id}.${key}`, 'realm', realmId);
      },
    },
    
    // 全局配置和注册表
    globals,
    
    // 导出对象（从 install 阶段获取）
    exports: plugin._exports || {},
    
    // 日志工具
    trace(...args) {
      if (trace) {
        logger.info(`[Plugin ${plugin.id}@${realmId}]`, ...args);
      }
    },
    
    warn(...args) {
      logger.warn(`[Plugin ${plugin.id}@${realmId}]`, ...args);
    },
    
    error(...args) {
      logger.error(`[Plugin ${plugin.id}@${realmId}]`, ...args);
    },
  };
}

/**
 * TypeScript 类型定义
 * 
 * @typedef {Object} RealmConfig
 * @property {string} sandboxId - Sandbox ID
 * @property {'root'|'worker'|'iframe'|'worklet'} [type] - Realm 类型
 * @property {Plugin[]} plugins - 插件列表
 * @property {StateRegistry} stateRegistry - 状态注册表
 * @property {boolean} trace - 是否启用追踪
 * @property {Logger} logger - 日志工具
 * 
 * @typedef {Object} Realm
 * @property {string} id - Realm ID
 * @property {string} type - Realm 类型
 * @property {string} sandboxId - Sandbox ID
 * @property {any} global - 全局对象
 * @property {function(string, EvalOptions): any} evaluate - 执行代码
 * @property {function(string): any} getState - 获取状态
 * @property {function(string, any): void} setState - 设置状态
 * @property {function(): Promise<void>} reset - 重置
 * @property {function(): Promise<void>} destroy - 销毁
 * @property {function(): Object} inspect - 调试信息
 * 
 * @typedef {Object} EvalOptions
 * @property {string} [filename] - 文件名
 * @property {number} [timeout] - 超时时间（毫秒）
 * @property {boolean} [displayErrors] - 是否显示错误
 */

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
import { createRealmPluginContext } from './plugin-context.js';
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
const URL_SEARCH_PARAMS_INSTALLER_URL = new URL(
  '../../surface/install/install-url-search-params.js',
  import.meta.url,
);
const URL_INSTALLER_URL = new URL(
  '../../surface/install/install-url.js',
  import.meta.url,
);
const TEXT_ENCODING_INSTALLER_URL = new URL(
  '../../surface/install/install-text-encoding.js',
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
    runtime: runtimeInput = {},
    limits = {},
  } = config;
  
  const realmId = `${sandboxId}-realm-${++realmIdCounter}`;
  
  logger.info(`[Realm ${realmId}] Creating realm of type: ${type}`);
  
  // 1. 创建 vm.Context
  const page = new URL(pageUrl);
  const realmOrigin = origin ?? page.origin;
  const context = vm.createContext(Object.create(null), {
    name: realmId,
    origin: realmOrigin,
    codeGeneration: {
      strings: true,
      wasm: true,
    },
  });
  const moduleLoader = new RealmModuleLoader(context);
  let baseGlobals = null;
  let pageScriptObserver = null;
  let pageScriptDispose = null;
  const activatedPlugins = [];
  let disposal = null;
  let closed = false;
  const children = new Set();
  const runtime = { ...runtimeInput };
  for (const name of ['childRealmFactory', 'workerFactory', 'sharedWorkerFactory', 'workletFactory']) {
    const factory = runtimeInput[name];
    if (typeof factory !== 'function') continue;
    runtime[name] = async options => {
      if (closed) throw new Error('Owner Realm has been closed');
      const handle = await factory({ ...options, isOwnerActive: () => !closed });
      if (closed) {
        await handle?.close?.();
        throw new Error('Owner Realm has been closed');
      }
      if (handle?.close) children.add(handle);
      return handle;
    };
  }

  // 创建失败与正常销毁共用回滚；插件在清理期间仍需使用 Realm 模块。
  function disposeResources() {
    if (disposal !== null) return disposal;
    closed = true;
    baseGlobals?.disposeTimers();
    disposal = (async () => {
      try {
        for (const child of children) await child.close();
        children.clear();
        pageScriptObserver?.disconnect?.();
        pageScriptObserver = null;
        pageScriptDispose?.();
        pageScriptDispose = null;
      } finally {
        try {
          for (const plugin of [...activatedPlugins].reverse()) {
            if (!plugin.dispose) continue;
            try {
              await plugin.dispose(createRealmPluginContext({
                plugin, vmContext: context, sandboxId, realmId, stateRegistry,
                globals, logger, trace, realmType: type, moduleLoader,
                pageUrl, pageHtml, runtime,
              }));
            } catch (error) {
              logger.error(`[Realm ${realmId}] Plugin dispose failed:`, error);
            }
          }
        } finally {
          moduleLoader.dispose();
          stateRegistry.destroyContext('realm', realmId);
        }
      }
    })();
    return disposal;
  }

  // 构建是事务：覆盖预加载、插件激活和页面解析所有失败点。
  try {

  // 预加载同步回调依赖的模块。
  // Node 18–22 无法同步链接，但 ServiceWorker controllerchange、
  // postMessage 派送等回调必须保持同步语义，因此在这里（异步上下文）
  // 先把它们求值完，回调内只需查缓存。
  await moduleLoader.preload(SYNC_CALLBACK_MODULE_URLS);
  
  // 2. 初始化基础全局对象
  baseGlobals = initializeBaseGlobals(context, realmId, logger);
  // URL/TextEncoder 不是 ECMAScript 内建，但必须先由 Realm 自己的 surface
  // 安装器提供，插件激活阶段会依赖它们。不能把 Node 宿主构造器直接放进
  // context：其 `.constructor` 会回到宿主 Function，重新打开沙箱逃逸路径。
  const urlSearchParamsInstaller = await moduleLoader.importUrlAsync(
    URL_SEARCH_PARAMS_INSTALLER_URL,
  );
  urlSearchParamsInstaller.namespace.installURLSearchParams();
  const urlInstaller = await moduleLoader.importUrlAsync(URL_INSTALLER_URL);
  urlInstaller.namespace.installURL();
  const textEncodingInstaller = await moduleLoader.importUrlAsync(
    TEXT_ENCODING_INSTALLER_URL,
  );
  textEncodingInstaller.namespace.installTextEncoding();
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
      // 激活中途失败的插件也可能已经分配资源，需要参与回滚。
      activatedPlugins.push(plugin);
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
      // 保留 code / cause 透传：错误边界（IKF39T）要求安装失败的原始
      // 分类（如 ERR_SCRIPT_EXECUTION_TIMEOUT、ERR_NV8_SCRIPT_POLICY_REJECTED）
      // 在包装后仍可判定。
      const wrapped = new Error(
        `Failed to activate plugin "${plugin.id}" in realm "${realmId}": ${error.message}`,
        { cause: error },
      );
      wrapped.code = error.code ?? 'ERR_NV8_PLUGIN_ACTIVATION_FAILED';
      wrapped.pluginId = plugin.id;
      wrapped.realmId = realmId;
      throw wrapped;
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
  const parserExecutedScripts = new WeakSet();
  if (hasDocumentPlugin && pageHtml !== '') {
    const parserModule = await moduleLoader.importUrlAsync(PAGE_PARSER_URL);
    if (!parserModule?.namespace?.parsePageHTML) {
      throw new Error('Realm module loader cannot install page parser');
    }
    const parserExecutor = createParserScriptExecutor({
      context,
      pageUrl,
      replay,
      lifecycleModule,
      scriptPolicy: runtime.scriptPolicy,
      executedScripts: parserExecutedScripts,
      timeoutMs: limits.timeoutMs ?? 5000,
    });
    lifecycleModule.namespace.setDocumentParserScriptExecutorForPage?.(parserExecutor);
    parserModule.namespace.parsePageHTML(pageHtml);
    const parserFailures = parserExecutor.getFailures?.() ?? [];
    if (parserFailures.length > 0) {
      // 内联脚本超时是致命错误：Realm 已经被死循环拖死，创建流程必须
      // 以结构化错误失败，而不是吞成一个 error 事件（IKF39K）。
      const failure = parserFailures[0];
      const error = new Error(
        `Inline script execution timed out: ${failure.url}`,
        { cause: failure.error },
      );
      error.code = failure.error?.code ?? 'ERR_SCRIPT_EXECUTION_TIMEOUT';
      error.url = failure.url;
      error.timeoutMs = limits.timeoutMs ?? 5000;
      throw error;
    }
    const pageScripts = await executePageScripts({
      context,
      document: context.document,
      pageUrl,
      replay,
      lifecycleModule,
      scriptPolicy: runtime.scriptPolicy,
      executedScripts: parserExecutedScripts,
      timeoutMs: limits.timeoutMs ?? 5000,
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
        timeoutMs: limits.timeoutMs ?? 5000,
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

  // 生命周期闸门：destroy() 是可重入的（sandbox 的销毁路径可能从多个入口
  // 触发），但真正的清理只做一次。`realm.destroyed` 供 sandbox/导航回调
  // 判断 Realm 是否还活着（IKFD9F）。
  const realm = {
    id: realmId,
    type,
    sandboxId,
    // 生命周期标志。realm-factory 的 destroy() 必须同步置位：
    // sandbox 的 onNavigate / replaceRootWindowClient 都以此为闸门。
    destroyed: false,
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
     * 注意：销毁后的 Realm 仍允许求值。VM context 本身不随 destroy 回收，
     * 既有契约（engine-lifecycle-fix-test、root-window-client-navigation-test）
     * 依赖在旧句柄上读取冻结后的状态快照；资源清理由 destroy() 完成，
     * 子 Realm 创建的闸门在恢复闭包（disposeResources）里单独处理。
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
            const pluginContext = createRealmPluginContext({
              plugin,
              vmContext: context,
              sandboxId,
              realmId,
              stateRegistry,
              globals,
              logger,
              trace,
              realmType: type,
              moduleLoader,
            });
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
      realm.destroyed = true;
      await disposeResources();
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

  return realm;
  } catch (error) {
    try {
      await disposeResources();
    } catch (cleanupError) {
      logger.error(`[Realm ${realmId}] Creation rollback failed:`, cleanupError);
    }
    throw error;
  }
}

function encodeNavigatorLanguages(languages) {
  return languages.map(language => `${language}`)
    .map(language => `${language.length}:${language}`)
    .join('');
}

/**
 * 初始化基础全局对象
 *
 * ## 为什么不再注入宿主内建（IKF399）
 * 迁移前这里逐项把宿主的 `Object` / `Function` / `Array` / `Error` / `Promise` /
 * `JSON` 等赋给 vm context。`vm.createContext()` 创建的 context 本身已经自带
 * **一整套独立的内建**，覆盖它们既没有收益，还把宿主 realm 直接交给了目标脚本：
 *
 *   nv8Eval('Function("return process")()')   // 拿到宿主的 process
 *
 * 因此这里只保留 vm context 缺失的宿主能力（调度原语），其余一律使用 realm
 * 自带内建。宿主函数不再直接挂到全局，而是在 realm 内建一层转发闭包：
 * 转发函数由 realm 求值创建，`setTimeout.constructor` 是 realm 的 Function，
 * 不会经由 `.constructor` 链泄漏宿主 Function。
 *
 * 宿主计时器句柄只存在私有映射中，页面仅得到数字 ID；销毁时统一清除，避免
 * 销毁后的页面定时器继续执行甚至触发导航重建 Realm（IKFD9F）。
 */
function initializeBaseGlobals(context, realmId, logger) {
  const timers = { handles: new Map(), closed: false };

  const installHostBridge = vm.runInContext(
    `(host, timers) => {
      let nextTimerId = 1;
      const define = (name, value) => {
        Object.defineProperty(globalThis, name, {
          value,
          writable: true,
          enumerable: false,
          configurable: true,
        });
      };
      const assertHandler = (name, handler) => {
        if (typeof handler !== 'function') {
          throw new TypeError(
            "Failed to execute '" + name + "': handler must be a function",
          );
        }
      };
      define('setTimeout', function setTimeout(handler, timeout, ...args) {
        assertHandler('setTimeout', handler);
        if (timers.closed) return 0;
        const id = nextTimerId++;
        const delay = Number(timeout) || 0;
        const handle = host.setTimeout(() => {
          if (timers.closed || !timers.handles.has(id)) return;
          timers.handles.delete(id);
          handler(...args);
        }, delay);
        timers.handles.set(id, handle);
        return id;
      });
      define('setInterval', function setInterval(handler, timeout, ...args) {
        assertHandler('setInterval', handler);
        if (timers.closed) return 0;
        const id = nextTimerId++;
        const delay = Number(timeout) || 0;
        const handle = host.setInterval(() => {
          if (timers.closed || !timers.handles.has(id)) return;
          handler(...args);
        }, delay);
        timers.handles.set(id, handle);
        return id;
      });
      define('clearTimeout', function clearTimeout(value) {
        const id = Number(value);
        const handle = timers.handles.get(id);
        timers.handles.delete(id);
        host.clearTimeout(handle);
      });
      define('clearInterval', function clearInterval(value) {
        const id = Number(value);
        const handle = timers.handles.get(id);
        timers.handles.delete(id);
        host.clearInterval(handle);
      });
      define('queueMicrotask', function queueMicrotask(callback) {
        assertHandler('queueMicrotask', callback);
        if (timers.closed) return;
        host.queueMicrotask(() => { if (!timers.closed) callback(); });
      });

      // 内建表面镜像：vm 的 globalThis 内建不是宿主可从 context 对象上读到的
      // 自有属性，插件（在宿主侧求值）访问 context.global.Function.prototype
      // 会拿到 undefined。这里把它们重写为同名自有属性——值仍是 realm 自己
      // 的内建，不引入任何宿主对象，只恢复宿主侧插件的可见性。
      const mirror = [
        'Object', 'Function', 'Array', 'String', 'Number', 'Boolean', 'Symbol',
        'BigInt', 'Date', 'RegExp', 'Error', 'EvalError', 'RangeError',
        'ReferenceError', 'SyntaxError', 'TypeError', 'URIError', 'AggregateError',
        'Map', 'Set', 'WeakMap', 'WeakSet',
        'ArrayBuffer', 'SharedArrayBuffer', 'DataView',
        'Int8Array', 'Uint8Array', 'Uint8ClampedArray', 'Int16Array',
        'Uint16Array', 'Int32Array', 'Uint32Array', 'Float32Array',
        'Float64Array', 'BigInt64Array', 'BigUint64Array',
        'Promise', 'Proxy', 'Reflect', 'JSON', 'Math',
        'parseInt', 'parseFloat', 'isNaN', 'isFinite',
        'decodeURI', 'decodeURIComponent', 'encodeURI', 'encodeURIComponent',
        'escape', 'unescape',
      ];
      for (const name of mirror) {
        globalThis[name] = globalThis[name];
      }
    }`,
    context,
  );

  installHostBridge(
    { setTimeout, clearTimeout, setInterval, clearInterval, queueMicrotask },
    timers,
  );

  // 全局变量
  context.undefined = undefined;
  context.NaN = NaN;
  context.Infinity = Infinity;

  // globalThis 指向自己
  context.globalThis = context;

  // 使 context 看起来像浏览器全局对象
  context.self = context;
  // 不注入 `global`：真实浏览器没有它，bootstrap 路径的 hideNodeGlobals()
  // 也显式删除它，全局泄漏审计把它的存在视为 Node 泄漏。

  return {
    /**
     * 清空 realm 作用域的宿主定时器。
     *
     * setInterval 的包装会在回调里检查句柄是否还在集合中：销毁后再触发的
     * 已过期 interval 回调会被丢弃，即使宿主事件循环里还有残余调度。
     */
    disposeTimers() {
      timers.closed = true;
      for (const handle of timers.handles.values()) {
        clearTimeout(handle);
        clearInterval(handle);
      }
      timers.handles.clear();
    },
  };
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
  
  const pluginContext = createRealmPluginContext({
    plugin,
    vmContext: context,
    sandboxId,
    realmId,
    stateRegistry,
    globals,
    logger,
    trace,
    realmType: type,
    moduleLoader,
    pageUrl,
    pageHtml,
    runtime,
  });
  
  await plugin.activate(pluginContext);
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

/**
 * Core Sandbox - 沙箱容器
 * 
 * Sandbox 是插件的执行环境，负责：
 * 1. 安装和初始化插件
 * 2. 创建和管理 Realm
 * 3. 提供插件能力访问接口
 * 4. 管理沙箱级别的状态
 */

import vm from 'node:vm';
import { Buffer } from 'node:buffer';
import { createHash } from 'node:crypto';
import { createRealm } from './realm-factory.js';
import { createWorkletRealm } from '../realm/create-worklet-realm.js';
import { destroyRealm as destroyWorkletRealm } from '../realm/destroy-realm.js';
import { evaluateWithDeadline } from '../realm/module-link-strategy.js';
import { createSandboxPluginContext } from './plugin-context.js';
import { createNativeFunctionRegistry } from './native-function-registry.js';
import { createEventListenerRegistry } from './event-listener-registry.js';
import { createObjectURLRegistry } from './object-url-registry.js';
import { createLifecycleRecorder } from './lifecycle-events.js';
import { hasRealmValue } from './realm-probe.js';
import {
  createScriptInjector,
  SCRIPT_LOAD_STRATEGY,
} from './script-injector.js';
import {
  assertEvidenceSource,
  resolveTrustedScriptIds,
} from './evidence-contract.js';

let sandboxIdCounter = 0;
let evidenceBridgeCounter = 0;

// 下面四个常量看起来像「Core 穿透到 api / install 层」，实际上是这套架构的
// **必要机制**：这些模块操作的是 Realm 的 `globalThis`，必须由 Realm 自己的
// moduleLoader 加载（`importUrlSyncCached` / `importUrlAsync`）。改成顶部静态 `import`
// 会把表面装到**宿主进程**的 globalThis 上——那是污染，不是分层。
//
// 同一条约束解释了为什么插件的三参数 `install()` 会被当成 legacy 跳过，
// 而真正装表面得在 `activate(context)` 里经 `context.moduleLoader` 做。
const PAGE_LIFECYCLE_URL = new URL(
  '../../surface/install/install-page-lifecycle.js',
  import.meta.url,
);
const WORKER_GLOBAL_RUNTIME_URL = new URL(
  '../../surface/api/worker/worker-global-runtime.js',
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

/**
 * Worker 生命周期错误。
 *
 * 纯构造函数，不依赖沙箱状态；从 `createSandbox` 的闭包里提出来，
 * 既缩短巨型函数，也让调用方在创建 Realm 前就可复用。
 */
function createWorkerLifecycleError() {
  const error = new Error('Sandbox worker lifecycle is no longer active');
  error.code = 'ERR_NV8_WORKER_LIFECYCLE';
  return error;
}

/** Realm 生命周期错误（destroy/reset 之后的创建与导航都必须拒绝）。 */
function createRealmLifecycleError() {
  const error = new Error('Sandbox realm lifecycle is no longer active');
  error.code = 'ERR_NV8_REALM_LIFECYCLE';
  return error;
}

/** Worker 额度错误（深度 / realm 数 / 连接数）。 */
function createWorkerLimitError(code, limit, message) {
  const error = new DOMException(message, 'QuotaExceededError');
  Object.defineProperties(error, {
    nv8Code: { value: code, enumerable: true },
    limit: { value: limit, enumerable: true },
  });
  return error;
}

/**
 * Worker 额度账本：嵌套深度、realm 数、连接数与创建等待队列。
 *
 * 这些计数原先散落在 `createSandbox` 闭包里的三个 `let` 加两个集合，
 * 只有 worker 创建路径会动它们。集中进工厂后计数不外泄，
 * `diagnose()` / `inspect()` 通过只读 getter 取快照。
 *
 * `workerRealms` 由调用方持有（destroy/reset 也要遍历），这里只读 `size`。
 *
 * @param {object} limits
 * @param {Set<object>} workerRealms
 */
function createWorkerBudget(limits, workerRealms) {
  let pendingCreations = 0;
  const creationWaiters = new Set();
  let connections = 0;
  const connectionReleases = new WeakMap();

  function trackWorkerConnection(realm, release) {
    let releases = connectionReleases.get(realm);
    if (releases === undefined) {
      releases = new Set();
      connectionReleases.set(realm, releases);
    }
    releases.add(release);
  }

  function releaseWorkerConnections(realm) {
    const releases = connectionReleases.get(realm);
    if (releases === undefined) return;
    connectionReleases.delete(realm);
    for (const release of releases) release();
    releases.clear();
  }

  function reserveWorker(depth, connection) {
    const workerDepth = Number.isSafeInteger(depth) && depth >= 0 ? depth : 1;
    const maxWorkerDepth = limits.maxWorkerDepth ?? 64;
    const maxWorkerRealms = limits.maxWorkerRealms ?? limits.maxRealms ?? 64;
    const maxWorkerConnections = limits.maxWorkerConnections ?? 4096;
    if (workerDepth > maxWorkerDepth) {
      throw createWorkerLimitError(
        'LIMIT_WORKER_DEPTH',
        maxWorkerDepth,
        'The sandbox worker nesting depth limit has been reached.',
      );
    }
    if (workerRealms.size + pendingCreations >= maxWorkerRealms) {
      throw createWorkerLimitError(
        'LIMIT_WORKER_REALMS',
        maxWorkerRealms,
        'The sandbox worker realm limit has been reached.',
      );
    }
    if (connection && connections >= maxWorkerConnections) {
      throw createWorkerLimitError(
        'LIMIT_WORKER_CONNECTIONS',
        maxWorkerConnections,
        'The sandbox worker connection limit has been reached.',
      );
    }
    pendingCreations += 1;
    if (connection) connections += 1;
    const state = { released: false, connectionReleased: !connection };
    return {
      depth: workerDepth,
      releasePending() {
        pendingCreations = Math.max(0, pendingCreations - 1);
        if (pendingCreations === 0) {
          for (const resolve of creationWaiters) resolve();
          creationWaiters.clear();
        }
      },
      releaseConnection() {
        if (!state.connectionReleased) {
          state.connectionReleased = true;
          connections = Math.max(0, connections - 1);
        }
      },
    };
  }

  function waitForWorkerCreations() {
    if (pendingCreations === 0) return Promise.resolve();
    return new Promise(resolve => creationWaiters.add(resolve));
  }

  function reserveWorkerConnection(depth) {
    const workerDepth = Number.isSafeInteger(depth) && depth >= 0 ? depth : 1;
    const maxWorkerDepth = limits.maxWorkerDepth ?? 64;
    const maxWorkerConnections = limits.maxWorkerConnections ?? 4096;
    if (workerDepth > maxWorkerDepth) {
      throw createWorkerLimitError(
        'LIMIT_WORKER_DEPTH',
        maxWorkerDepth,
        'The sandbox worker nesting depth limit has been reached.',
      );
    }
    if (connections >= maxWorkerConnections) {
      throw createWorkerLimitError(
        'LIMIT_WORKER_CONNECTIONS',
        maxWorkerConnections,
        'The sandbox worker connection limit has been reached.',
      );
    }
    connections += 1;
    let released = false;
    return () => {
      if (released) return;
      released = true;
      connections = Math.max(0, connections - 1);
    };
  }

  return {
    reserveWorker,
    reserveWorkerConnection,
    waitForWorkerCreations,
    trackWorkerConnection,
    releaseWorkerConnections,
    get pendingCreations() {
      return pendingCreations;
    },
    get connections() {
      return connections;
    },
  };
}

/**
 * ServiceWorker 客户端视图与 controller 索引。
 *
 * `findServiceWorkerController` / `getServiceWorkerClients` /
 * `notifyServiceWorkerClients` 原先直接写在 `createSandbox` 里，共享
 * `serviceWorkerHandles`、`windowClients`、`realms` 三个注册表。集中到一个
 * 工厂后，这三张表的读写语义在一处维护，`createSandbox` 只解构入口。
 */
function createServiceWorkerClientRegistry({
  realms,
  windowClients,
  serviceWorkerHandles,
}) {
  function findServiceWorkerController(url) {
    let selected = null;
    for (const [scope, handle] of serviceWorkerHandles) {
      // 已销毁的 handle 是 stale：reset()/destroy() 之后不能再把
      // 已终止的 controller 交给新 Realm（IKFD9G）。
      if (handle.destroyed === true || handle.realm?.destroyed === true) {
        serviceWorkerHandles.delete(scope);
        continue;
      }
      if (!serviceWorkerScopeMatches(scope, url)) continue;
      if (selected === null || scope.length > selected.scope.length) {
        selected = { scope, handle };
      }
    }
    if (selected === null) return null;
    return {
      scriptURL: selected.handle.scriptURL,
      scope: selected.scope,
      version: selected.handle.version ?? null,
      handle: selected.handle,
    };
  }

  function findWindowClientById(id) {
    return [...windowClients.values()].find(client => client.id === id) ?? null;
  }

  function createWindowClientSnapshot(client, targetHandle = null) {
    const realm = realms.get(client.realmId);
    const controller = findServiceWorkerController(client.url);
    const controlled = targetHandle === null
      ? controller !== null
      : controller?.handle === targetHandle;
    return {
      id: client.id,
      url: client.url,
      frameType: client.frameType,
      type: 'window',
      visibilityState: client.visibilityState,
      focused: client.focused,
      controlled,
      focus: async () => {
        for (const candidate of windowClients.values()) {
          candidate.focused = candidate.id === client.id;
        }
        return createWindowClientSnapshot(client, targetHandle);
      },
      navigate: async url => {
        const next = new URL(`${url}`, client.url);
        if (next.origin !== new URL(client.url).origin) return null;
        if (typeof client.navigatePage === 'function') {
          await client.navigatePage(next.href);
          const replacement = findWindowClientById(client.id);
          return replacement === null
            ? null
            : createWindowClientSnapshot(replacement, targetHandle);
        }
        client.url = next.href;
        const nextController = findServiceWorkerController(client.url);
        const module = realm?.moduleLoader?.importUrlSyncCached(SERVICE_WORKER_RUNTIME_URL);
        module?.namespace?.updateServiceWorkerController?.(nextController);
        return createWindowClientSnapshot(client, targetHandle);
      },
      postMessage: (message, ports) => {
        if (!realm || realm.destroyed) return;
        const module = realm.moduleLoader.importUrlSyncCached(SERVICE_WORKER_RUNTIME_URL);
        module?.namespace?.receiveServiceWorkerMessage?.(
          message,
          targetHandle?.scriptURL ?? null,
          ports,
        );
      },
    };
  }

  function getServiceWorkerClients(options = {}) {
    const includeUncontrolled = options.includeUncontrolled === true;
    const type = `${options.type ?? 'window'}`;
    const windowType = options.windowType ?? null;
    const scope = options.scope ?? null;
    const targetHandle = options.handle ?? null;
    const originSource = options.origin ?? targetHandle?.scriptURL ?? scope;
    let origin = null;
    try {
      origin = originSource === null ? null : new URL(originSource).origin;
    } catch {
      return [];
    }
    if (type !== 'window' && type !== 'all') return [];
    return [...windowClients.values()]
      .filter(client => origin === null || new URL(client.url).origin === origin)
      .filter(client => scope === null || serviceWorkerScopeMatches(scope, client.url))
      .filter(client => windowType === null || client.frameType === windowType)
      .map(client => createWindowClientSnapshot(client, targetHandle))
      .filter(client => includeUncontrolled || client.controlled);
  }

  function notifyServiceWorkerClients(scope, handle) {
    const snapshot = handle === null ? null : {
      scriptURL: handle.scriptURL,
      scope,
      version: handle.version ?? null,
      handle,
    };
    for (const [realmId, client] of windowClients) {
      const realm = realms.get(realmId);
      if (!realm) continue;
      if (scope !== null && !serviceWorkerScopeMatches(scope, client.url)) continue;
      const module = realm.moduleLoader.importUrlSyncCached(SERVICE_WORKER_RUNTIME_URL);
      module?.namespace?.updateServiceWorkerController?.(snapshot);
    }
  }

  function disposeServiceWorkerHandles() {
    for (const handle of new Set(serviceWorkerHandles.values())) {
      handle.terminate?.();
    }
    serviceWorkerHandles.clear();
    notifyServiceWorkerClients(null, null);
  }

  return {
    findServiceWorkerController,
    getServiceWorkerClients,
    createWindowClientSnapshot,
    notifyServiceWorkerClients,
    disposeServiceWorkerHandles,
  };
}

/**
 * 创建 Sandbox
 * 
 * @param {SandboxConfig} config - 配置
 * @returns {Promise<Sandbox>}
 */
export async function createSandbox(config) {
  const sandboxId = `sandbox-${++sandboxIdCounter}`;
  const {
    appId,
    profile,
    plugins: pluginDefinitions,
    stateRegistry,
    trace,
    logger,
    replay = [],
    runtime = {},
    limits = {},
  } = config;
  // 安装状态属于 Sandbox，不能复用调用方插件上的 _installed 标志。
  const plugins = pluginDefinitions.map(plugin => ({ ...plugin, _installed: false, _exports: null }));
  
  // Realm 管理
  const realms = new Map(); // realm-id -> Realm
  let pendingRealmCreations = 0;
  const workerRealms = new Set();
  const workerBudget = createWorkerBudget(limits, workerRealms);
  const {
    reserveWorker,
    reserveWorkerConnection,
    waitForWorkerCreations,
    trackWorkerConnection,
    releaseWorkerConnections,
  } = workerBudget;
  let lifecycleGeneration = 0;
  let lifecycleClosed = false;
  // 真正的 root realm id（形如 `${sandboxId}-realm-N`）。
  // 以前 `realms.get('root')` 永远取不到——id 从来不是字面量 'root'
  // （IKF39V(a)）。这里记录实际句柄，evaluate 用它解析。
  // root realm id 的可变持有者：replaceRootWindowClient 会更新它（IKF39V(a)）。
  const rootRealm = { id: null };

  // 插件实例
  const pluginInstances = [];
  
  // 能力索引
  const capabilityIndex = new Map(); // capability-name -> Plugin
  const evidenceResources = new Map(); // realm-id -> injector/observer
  const { evidence = null } = config;
  // Core 只接受抽象 EvidenceSource。兼容旧的 `evidenceBundle` 配置名：
  // 已经符合契约的直接使用，否则交由调用方包装。
  const evidenceSourceInput = config.evidenceSource ?? config.evidenceBundle ?? null;
  const evidenceSource = evidenceSourceInput === null
    ? null
    : assertEvidenceSource(evidenceSourceInput, 'config.evidenceSource');
  
  // 全局注册表（跨 Realm 共享）
  const nativeFunctionRegistry = createNativeFunctionRegistry();
  const eventListenerRegistry = createEventListenerRegistry();
  const objectURLRegistry = createObjectURLRegistry();
  const surfaceRegistry = createSurfaceRegistry();
  const broadcastGroups = new Map();
  const sharedWorkerRecords = new Map();
  // 同 key 的 SharedWorker 创建互斥：key -> in-flight promise（IKFD9H）
  const sharedWorkerCreations = new Map();
  const workletRealmsByOwner = new WeakMap();
  const workletRealms = new Set();
  const workerReplayState = createWorkerReplayState(replay);
  const serviceWorkerHandles = new Map();
  const windowClients = new Map();
  const {
    findServiceWorkerController,
    getServiceWorkerClients,
    notifyServiceWorkerClients,
    disposeServiceWorkerHandles,
  } = createServiceWorkerClientRegistry({
    realms,
    windowClients,
    serviceWorkerHandles,
  });
  let nextWindowClientId = 1;
  const serviceWorkerContainers = new Map();
  const lifecycle = createLifecycleRecorder({
    maxEntries: limits.maxLifecycleEntries,
  });
  lifecycle.emit('sandbox.created', { sandboxId, appId });
  const defaultBroadcastConnector = (name, receive) => {
    const key = `${new URL(profile.url || 'https://example.com/').origin}\0${name}`;
    let group = broadcastGroups.get(key);
    if (group === undefined) {
      group = new Set();
      broadcastGroups.set(key, group);
    }
    const endpoint = { receive };
    group.add(endpoint);
    return {
      publish(message) {
        for (const candidate of group) {
          if (candidate !== endpoint) candidate.receive(message);
        }
      },
      close() {
        group.delete(endpoint);
        if (group.size === 0) broadcastGroups.delete(key);
      },
    };
  };
  
  // 全局配置对象
  const globals = {
    nativeFunctionRegistry,
    eventListenerRegistry,
    objectURLRegistry,
  };

  // 生命周期闸门读数器：destroy/reset 在 await 之间改写这两个值，
  // 工厂必须实时读取（见 createWorkerRealmFactories 的注释）。
  const lifecycleState = {
    get closed() { return lifecycleClosed; },
    get generation() { return lifecycleGeneration; },
  };

  // 所有创建入口共享一个预算；不能只保护公开 createRealm 而漏掉 DOM 工厂。
  function reserveRealmCapacity() {
    if (lifecycleClosed) throw createRealmLifecycleError();
    if (realms.size + workletRealms.size + pendingRealmCreations >= (limits.maxRealms ?? 64)) {
      const error = new Error('Realm capacity limit exceeded');
      error.code = 'LIMIT_REALM_CAPACITY';
      error.limit = limits.maxRealms ?? 64;
      throw error;
    }
    pendingRealmCreations += 1;
    let reserved = true;
    return () => {
      if (!reserved) return;
      reserved = false;
      pendingRealmCreations -= 1;
    };
  }

  const workerFactories = createWorkerRealmFactories({
    sandboxId,
    profile,
    pluginInstances,
    stateRegistry,
    globals,
    trace,
    logger,
    replay,
    limits,
    runtime,
    broadcastConnector: defaultBroadcastConnector,
    workerReplayState,
    lifecycleState,
    realms,
    workerRealms,
    sharedWorkerRecords,
    sharedWorkerCreations,
    workletRealmsByOwner,
    workletRealms,
    serviceWorkerHandles,
    reserveWorker,
    reserveRealmCapacity,
    reserveWorkerConnection,
    trackWorkerConnection,
    releaseWorkerConnections,
    getServiceWorkerClients,
    notifyServiceWorkerClients,
  });
  const windowFactories = createWindowRealmFactories({
    sandboxId,
    profile,
    pluginInstances,
    stateRegistry,
    globals,
    trace,
    logger,
    replay,
    limits,
    runtime,
    broadcastConnector: defaultBroadcastConnector,
    lifecycleState,
    realms,
    windowClients,
    serviceWorkerContainers,
    evidenceResources,
    evidenceSource,
    evidence,
    lifecycle,
    rootRealm,
    counter: { nextClientId: () => nextWindowClientId++ },
    findServiceWorkerController,
    getServiceWorkerClients,
    interceptFetch: workerFactories.interceptServiceWorkerFetch,
    workers: workerFactories,
    reserveRealmCapacity,
  });

  /** 构造插件钩子上下文（sandbox 级安装，realm 为 null）。 */
  const pluginContextFor = plugin => createSandboxPluginContext({
    plugin,
    sandboxId,
    realm: null,
    stateRegistry,
    globals,
    surfaceRegistry,
    logger,
    trace,
  });
  
  logger.info(`[Sandbox ${sandboxId}] Initializing with ${plugins.length} plugins`);
  
  // 1. 安装所有插件（按依赖顺序）
  try {
  for (const plugin of plugins) {
    await installPlugin(
      plugin,
      sandboxId,
      stateRegistry,
      globals,
      surfaceRegistry,
      logger,
      trace,
    );
    pluginInstances.push(plugin);
    
    // 建立能力索引，兼容 provides/capabilities 两种声明格式
    const declaredCapabilities = plugin.provides || plugin.capabilities || [];
    for (const capability of declaredCapabilities) {
      const name = typeof capability === 'string'
        ? capability
        : capability.name;
      if (name) capabilityIndex.set(name, plugin);
    }
  }
  } catch (error) {
    for (const plugin of [...pluginInstances].reverse()) {
      try { await plugin.uninstall?.(pluginContextFor(plugin)); }
      catch (cleanupError) { logger.error('Plugin installation rollback failed:', cleanupError); }
      plugin._installed = false;
      plugin._exports = null;
    }
    stateRegistry.destroyContext('sandbox', sandboxId);
    throw error;
  }
  
  logger.info(`[Sandbox ${sandboxId}] All plugins installed`);

  return {
    id: sandboxId,
    appId,
    profile,
    plugins: pluginInstances,
    _disposed: false,
    
    /**
     * 创建 Realm
     * 
     * @param {RealmOptions} options - Realm 配置
     * @returns {Promise<Realm>}
     */
    async createRealm(options = {}) {
      if (this._disposed) {
        throw createRealmLifecycleError();
      }
      const generation = lifecycleGeneration;
      const releaseReservation = reserveRealmCapacity();
      try {
      const realmType = options.type || 'root';
      const pageUrl = options.pageUrl || profile.url || 'https://example.com/';
      let pageHtml = options.pageHtml
        || profile.pageHtml
        || '<!doctype html><html><head></head><body></body></html>';
      if (options.navigation === true) {
        const navigationResponse = await workerFactories.interceptServiceWorkerFetch({
          method: 'GET',
          url: pageUrl,
          headers: { accept: 'text/html' },
          body: null,
        });
        if (lifecycleClosed || generation !== lifecycleGeneration) {
          throw createRealmLifecycleError();
        }
        if (
          navigationResponse !== null
          && navigationResponse !== undefined
          && navigationResponse.body !== undefined
        ) {
          pageHtml = decodeNavigationBody(navigationResponse.body);
        }
      }
      
      logger.info(`[Sandbox ${sandboxId}] Creating realm: ${realmType}`);
      
      // 创建 realm 实例
      let realm;
      let rootClient = null;
      let pendingNavigation = null;
      realm = await createRealm({
        sandboxId,
        type: realmType,
        plugins: pluginInstances,
        stateRegistry,
        globals,
        trace,
        logger,
        pageUrl,
        pageHtml,
        replay: options.replay ?? replay,
        navigatorProfile: options.navigatorProfile ?? profile.navigator ?? {},
        timingProfile: options.timingProfile ?? profile.timing ?? null,
        limits,
        runtime: {
          broadcastConnector: defaultBroadcastConnector,
          childRealmFactory: windowFactories.createIframeChildRealm,
          windowContext: realmType === 'root'
            ? {
                origin: new URL(pageUrl).origin,
                sameOrigin: true,
              }
            : undefined,
          workerFactory: workerFactories.createDedicatedWorker,
          sharedWorkerFactory: workerFactories.createSharedWorkerConnection,
          workletFactory: workerFactories.createWorkletModule,
          serviceWorkerFactory: workerFactories.createServiceWorker,
          serviceWorkerFetch: workerFactories.interceptServiceWorkerFetch,
          ...(realmType === 'root' ? {
            beforeNavigate: () => realm
              ?.moduleLoader
              ?.importUrlSyncCached(PAGE_LIFECYCLE_URL)
              ?.namespace?.dispatchBeforeUnload?.() !== false,
            onNavigate: ({ url, mode }) => {
              if (lifecycleClosed || generation !== lifecycleGeneration) return;
              if (realm?.destroyed) return;
              if (rootClient === null) {
                pendingNavigation = { url, mode };
                return;
              }
              void windowFactories.replaceRootWindowClient(
                realm,
                rootClient,
                url,
                options,
                { beforeUnloadChecked: true },
              );
            },
          } : {}),
          serviceWorkerProfile: {
            enabled: true,
            controller: findServiceWorkerController(pageUrl),
            clients: options => getServiceWorkerClients(options),
            onControllerChange: snapshot => {
              const module = realm?.moduleLoader?.importUrlSyncCached(SERVICE_WORKER_RUNTIME_URL);
              module?.namespace?.updateServiceWorkerController?.(snapshot);
            },
          },
          ...runtime,
          ...(options.runtime || {}),
          workerDepth: options.workerDepth ?? 0,
          networkRequestRecorder: scopeNetworkRecorder(
            options.runtime?.networkRequestRecorder
              ?? runtime.networkRequestRecorder,
            'window',
            pageUrl,
          ),
        },
      });
      
      try {
        if (evidenceSource !== null && evidence?.executeScripts === true) {
          const resource = await injectEvidenceScripts(
            realm,
            evidenceSource,
            evidence,
            pageUrl,
            logger,
          );
          evidenceResources.set(realm.id, resource);
        }
        await completePageLifecycle(realm);
      } catch (error) {
        // 证据脚本 / 生命周期失败时必须回收这个半成品 Realm（IKFD9I）：
        // 此时它还没进 realms 表，调用方无法寻址，但它的定时器/观察者
        // 可能仍在执行。销毁并清理证据资源后再向上抛。
        evidenceResources.get(realm.id)?.dispose();
        evidenceResources.delete(realm.id);
        realm.destroyed = true;
        await realm.destroy().catch(destroyError => {
          logger.warn(
            `[Sandbox ${sandboxId}] Failed to dispose realm after creation error: ${destroyError.message}`,
          );
        });
        stateRegistry.destroyContext('realm', realm.id);
        throw error;
      }
      if (lifecycleClosed || generation !== lifecycleGeneration) {
        evidenceResources.get(realm.id)?.dispose();
        evidenceResources.delete(realm.id);
        realm.destroyed = true;
        await realm.destroy().catch(() => {});
        stateRegistry.destroyContext('realm', realm.id);
        throw createRealmLifecycleError();
      }
      realms.set(realm.id, realm);
      releaseReservation();
      if (realmType === 'root') rootRealm.id = realm.id;
      lifecycle.emit('realm.created', {
        sandboxId,
        realmId: realm.id,
        realmType,
      });
      if (realmType === 'root' || realmType === 'iframe') {
        const client = {
          id: `window-client-${nextWindowClientId++}`,
          realmId: realm.id,
          url: pageUrl,
          frameType: realmType === 'root' ? 'top-level' : 'nested',
          visibilityState: 'visible',
          focused: realmType === 'root',
        };
        if (realmType === 'root') {
          rootClient = client;
          client.navigatePage = value => windowFactories.replaceRootWindowClient(
            realm,
            client,
            value,
            options,
          );
        }
        windowClients.set(realm.id, client);
        serviceWorkerContainers.set(realm.id, realm);
        if (realmType === 'root' && pendingNavigation !== null) {
          const navigation = pendingNavigation;
          pendingNavigation = null;
          return await windowFactories.replaceRootWindowClient(
            realm,
            client,
            navigation.url,
            options,
            { beforeUnloadChecked: true },
          );
        }
      }
      
      logger.info(`[Sandbox ${sandboxId}] Realm created: ${realm.id}`);
      
      return realm;
      } finally {
        releaseReservation();
      }
    },
    
    /**
     * 销毁 Realm
     */
    async destroyRealm(realmId) {
      logger.info(`[Sandbox ${sandboxId}] Destroying realm: ${realmId}`);
      
      const realm = realms.get(realmId);
      if (!realm) {
        throw new Error(`Realm "${realmId}" not found`);
      }
      
      evidenceResources.get(realmId)?.dispose();
      evidenceResources.delete(realmId);
      if (rootRealm.id === realmId) rootRealm.id = null;
      if (workerRealms.has(realm)) {
        workerFactories.destroyWorkerRealm(realm);
      } else {
        await realm.destroy();
      }
      lifecycle.emit('realm.dispose.completed', {
        sandboxId,
        realmId,
      });
      realms.delete(realmId);
      windowClients.delete(realmId);
      serviceWorkerContainers.delete(realmId);
      
      // 清理 realm 状态
      stateRegistry.destroyContext('realm', realmId);
      
      logger.info(`[Sandbox ${sandboxId}] Realm destroyed: ${realmId}`);
    },
    
    /**
     * 获取 Realm
     */
    getRealm(realmId) {
      return realms.get(realmId);
    },
    
    /**
     * 获取所有 Realm
     */
    getAllRealms() {
      return Array.from(realms.values());
    },
    
    /**
     * 检查是否具有指定能力
     */
    hasCapability(capabilityName) {
      return capabilityIndex.has(capabilityName);
    },
    
    /**
     * 获取能力提供者
     */
    getCapability(capabilityName) {
      const plugin = capabilityIndex.get(capabilityName);
      return plugin ? plugin._exports : null;
    },
    
    /**
     * 获取所有能力
     */
    getAllCapabilities() {
      return Array.from(capabilityIndex.keys());
    },
    
    /**
     * 获取沙箱状态
     */
    getState(key) {
      return stateRegistry.get(key, 'sandbox', sandboxId);
    },
    
    /**
     * 设置沙箱状态
     */
    setState(key, value) {
      stateRegistry.set(key, value, 'sandbox', sandboxId);
    },
    
    /**
     * 访问状态注册表（供内部使用）
     */
    get state() {
      return {
        get: (key, scope) => {
          const contextId = scope === 'sandbox' ? sandboxId : null;
          return stateRegistry.get(key, scope, contextId);
        },
        set: (key, value, scope) => {
          const contextId = scope === 'sandbox' ? sandboxId : null;
          stateRegistry.set(key, value, scope, contextId);
        },
      };
    },
    
    /**
     * 销毁 Sandbox
     */
    async destroy() {
      logger.info(`[Sandbox ${sandboxId}] Destroying sandbox`);
      
      if (this._disposed) {
        return;
      }
      this._disposed = true;
      lifecycleClosed = true;
      lifecycleGeneration += 1;
      
      // 销毁所有 realm
      for (const [realmId] of realms) {
        await this.destroyRealm(realmId);
      }
      await waitForWorkerCreations();
      
      // 卸载所有插件
      for (const plugin of [...pluginInstances].reverse()) {
        if (plugin.uninstall && plugin._installed) {
          try {
            logger.info(`[Sandbox ${sandboxId}] Uninstalling plugin: ${plugin.id}`);
            const context = createSandboxPluginContext({
              plugin,
              sandboxId,
              realm: null,
              stateRegistry,
              globals,
              surfaceRegistry,
              logger,
              trace,
            });
            await plugin.uninstall(context);
          } catch (error) {
            logger.error(`[Sandbox ${sandboxId}] Plugin uninstall failed:`, error);
          }
        }
        plugin._installed = false;
        plugin._exports = null;
      }
      
      disposeServiceWorkerHandles();
      workerFactories.disposeSharedWorkerRecords();
      for (const workletRealm of workletRealms) {
        destroyWorkletRealm(workletRealm);
      }
      workletRealms.clear();
      // 清理沙箱状态
      broadcastGroups.clear();
      workerRealms.clear();
      stateRegistry.destroyContext('sandbox', sandboxId);
      
      lifecycle.emit('sandbox.dispose.completed', { sandboxId });
      logger.info(`[Sandbox ${sandboxId}] Sandbox destroyed`);
    },
    
    /**
     * dispose() 是 destroy() 的别名，符合通用 API 习惯
     */
    async dispose() {
      return this.destroy();
    },
    
    /**
     * 检查 Sandbox 是否已销毁
     */
    isDisposed() {
      return this._disposed === true;
    },
    
    /**
     * 在根 Realm 中执行代码
     */
    async evaluate(code, options = {}) {
      if (this._disposed) {
        throw new Error('Cannot evaluate on disposed sandbox');
      }
      
      const rootRealmInstance = rootRealm.id === null ? null : realms.get(rootRealm.id);
      if (!rootRealmInstance) {
        throw new Error('Root realm not found');
      }
      
      try {
        const result = await rootRealmInstance.evaluate(code, options);
        return { value: result, error: null };
      } catch (error) {
        return { value: undefined, error };
      }
    },
    
    /**
     * 重置 Sandbox（销毁所有 Realm 但保留插件）
     */
    async reset() {
      if (this._disposed) {
        throw new Error('Cannot reset disposed sandbox');
      }
      
      logger.info(`[Sandbox ${sandboxId}] Resetting sandbox`);
      lifecycleGeneration += 1;

      // 销毁所有 realm
      for (const [realmId] of [...realms]) {
        await this.destroyRealm(realmId);
      }
      await waitForWorkerCreations();

      // reset 的语义是「所有 Realm 全部失效」：ServiceWorker 注册与
      // SharedWorker 全局作用域也必须随 Realm 一起作废，否则新 Realm
      // 会拿到已销毁的 controller/record（IKFD9G / IKFD9H）。
      disposeServiceWorkerHandles();
      workerFactories.disposeSharedWorkerRecords();
      for (const workletRealm of workletRealms) {
        destroyWorkletRealm(workletRealm);
      }
      workletRealms.clear();
      rootRealm.id = null;

      lifecycle.emit('sandbox.reset', { sandboxId });
      logger.info(`[Sandbox ${sandboxId}] Sandbox reset completed`);
    },
    
    /**
     * 创建状态快照
     */
    async snapshot() {
      if (this._disposed) {
        throw new Error('Cannot snapshot disposed sandbox');
      }
      
      const state = await collectPluginSnapshots(
        pluginInstances,
        pluginContextFor,
        logger,
        sandboxId,
      );
      
      return {
        sandboxId,
        appId,
        profile: profile.id,
        state,
        timestamp: Date.now(),
      };
    },
    
    /**
     * 从快照恢复状态
     */
    async restore(snapshot) {
      if (this._disposed) {
        throw new Error('Cannot restore disposed sandbox');
      }
      
      if (!snapshot || !snapshot.state) {
        throw new Error('Invalid snapshot');
      }
      
      logger.info(`[Sandbox ${sandboxId}] Restoring from snapshot`);
      
      await restorePluginSnapshots(
        pluginInstances,
        pluginContextFor,
        snapshot,
        logger,
        sandboxId,
      );
      
      lifecycle.emit('sandbox.restore', { sandboxId, timestamp: snapshot.timestamp });
      logger.info(`[Sandbox ${sandboxId}] Restore completed`);
    },
    
    /**
     * 调试信息
     */
    diagnose() {
      return {
        sandboxId,
        appId,
        profile: profile.id ?? 'default',
        realms: Array.from(realms.keys()),
        lifecycle: lifecycle.snapshot(),
        workerRealms: workerRealms.size,
        pendingRealmCreations,
        pendingWorkerCreations: workerBudget.pendingCreations,
        workerConnections: workerBudget.connections,
        state: typeof stateRegistry.stats === 'function'
          ? { limits: stateRegistry.limits(), stats: stateRegistry.stats() }
          : null,
        limits: { ...limits },
      };
    },

    inspect() {
      return {
        id: sandboxId,
        appId,
        profile: profile.id,
        plugins: pluginInstances.map(p => `${p.id}@${p.version}`),
        capabilities: Array.from(capabilityIndex.keys()),
        realms: Array.from(realms.keys()),
        workerRealms: workerRealms.size,
        workerConnections: workerBudget.connections,
      };
    },
  };
}

/**
 * 安装单个插件
 */
async function installPlugin(
  plugin,
  sandboxId,
  stateRegistry,
  globals,
  surfaceRegistry,
  logger,
  trace,
) {
  if (plugin._installed) {
    return; // 已安装
  }
  
  logger.info(`[Sandbox ${sandboxId}] Installing plugin: ${plugin.id}@${plugin.version}`);
  
  // Legacy installers are host-global functions and cannot safely run before
  // a Realm-specific activate hook exists. Keep their metadata available while
  // preventing accidental installation into the host process.
  if (plugin.legacy === true) {
    logger.warn(
      `[Sandbox ${sandboxId}] Deferring legacy plugin installer: ${plugin.id}`,
    );
    plugin._exports = {};
    plugin._installed = true;
    return;
  }
  
  try {
    // 创建插件上下文
    const context = createSandboxPluginContext({
      plugin,
      sandboxId,
      realm: null, // realm 上下文为 null（sandbox 级别安装）
      stateRegistry,
      globals,
      surfaceRegistry,
      logger,
      trace,
    });
    
    // 调用统一的 install(context) 钩子。
    // 未经 PluginRegistry 标准化的旧插件仍保留兼容分支；显式标记
    // `legacy: false` 的插件（IKFD9P）一律走现代单参数契约。 
    if (plugin.install.length >= 2 && plugin.legacy !== false) {
      await plugin.install(
        { id: sandboxId, state: stateRegistry, globals },
        surfaceRegistry,
        globals,
      );
    } else {
      await plugin.install(context);
    }
    
    // 保存导出
    plugin._exports = context.exports || {};
    plugin._installed = true;
    
    logger.info(`[Sandbox ${sandboxId}] Plugin installed: ${plugin.id}@${plugin.version}`);
  } catch (error) {
    logger.error(`[Sandbox ${sandboxId}] Plugin install failed:`, error);
    throw new Error(
      `Failed to install plugin "${plugin.id}@${plugin.version}": ${error.message}`
    );
  }
}

/**
 * 收集所有插件的 serialize 状态。
 *
 * 单个插件失败只记日志并把该项置 null，不打断整个快照——这是 snapshot()
 * 既有契约。`createContext` 由调用方注入，避免把 Realm 级闭包搬出沙箱。
 */
async function collectPluginSnapshots(pluginInstances, createContext, logger, sandboxId) {
  const state = {};
  for (const plugin of pluginInstances) {
    if (!plugin.serialize) continue;
    try {
      state[plugin.id] = await plugin.serialize(createContext(plugin));
    } catch (error) {
      logger.error(`[Sandbox ${sandboxId}] Plugin snapshot failed:`, error);
      state[plugin.id] = null;
    }
  }
  return state;
}

/** 把快照状态交给插件的 restore 钩子；单个失败只记日志。 */
async function restorePluginSnapshots(
  pluginInstances,
  createContext,
  snapshot,
  logger,
  sandboxId,
) {
  for (const plugin of pluginInstances) {
    if (!plugin.restore || !snapshot.state[plugin.id]) continue;
    try {
      await plugin.restore(createContext(plugin), snapshot.state[plugin.id]);
    } catch (error) {
      logger.error(`[Sandbox ${sandboxId}] Plugin restore failed:`, error);
    }
  }
}

function createScriptElement(realm, url) {
  const document = realm.global.document;
  if (!document?.createElement) return null;
  const element = document.createElement('script');
  element.src = url;
  return element;
}

async function completePageLifecycle(realm) {
  // 用描述符探测而非取值：取值会触发缺失能力诊断 getter（ADR-0002），
  // 让 Core 自身的构建流程崩在诊断上。
  if (!hasRealmValue(realm.global, 'document') || !realm.moduleLoader) return;
  const lifecycle = realm.moduleLoader.importUrlSyncCached(PAGE_LIFECYCLE_URL)?.namespace;
  lifecycle?.ensureDocumentEventTargetForPage?.();
  lifecycle?.setPageInteractive?.();
  // 走 lifecycle 的派发函数而非直接 evaluate：派发目标（document vs window）
  // 和冒泡设置是规范细节，集中在 install-page-lifecycle.js 里维护，
  // 避免两处实现分叉。
  if (typeof lifecycle?.dispatchDOMContentLoaded === 'function') {
    lifecycle.dispatchDOMContentLoaded();
  } else {
    realm.evaluate("document.dispatchEvent(new Event('DOMContentLoaded', { bubbles: true }))");
  }
  await realm.pageScriptAsyncComplete;
  lifecycle?.setPageComplete?.();
  if (typeof lifecycle?.dispatchLoad === 'function') {
    lifecycle.dispatchLoad();
  } else {
    realm.evaluate("globalThis.dispatchEvent(new Event('load'))");
  }
}

async function injectEvidenceScripts(realm, source, evidence, pageUrl, logger) {
  // 策略解析完全交给契约层，Core 不再判断具体策略常量
  const scriptIds = await resolveTrustedScriptIds(source, evidence);

  const resolveSource = async sourceUrl => {
    const resolvedUrl = new URL(sourceUrl, pageUrl).href;
    const declared = await source.listScripts();
    const match = declared.find(candidate => (
      new URL(candidate.id, pageUrl).href === resolvedUrl
    ));
    if (!match) throw new TypeError(`Evidence script is not declared: ${resolvedUrl}`);
    return source.readText(match.id);
  };
  const lifecycle = realm.moduleLoader?.importUrlSyncCached(PAGE_LIFECYCLE_URL)?.namespace ?? null;
  const injector = createScriptInjector(realm, {
    strategy: SCRIPT_LOAD_STRATEGY.ASYNC,
    lifecycle,
    logger,
  });
  const bridgeName = `__nv8EvidenceScriptBridge${++evidenceBridgeCounter}`;
  const document = realm.global.document;
  let observer = { disconnect() {} };
  if (document && realm.global.MutationObserver) {
    realm.global[bridgeName] = sourceUrl => {
      void resolveSource(sourceUrl)
        .then(source => {
          const url = new URL(sourceUrl, pageUrl).href;
          const element = createScriptElement(realm, url);
          return injector.registerScript(url, source, {
            strategy: SCRIPT_LOAD_STRATEGY.ASYNC,
            async: true,
            element,
          });
        })
        // 原来是 `console.error(error)`：Core 层直接打 stdout 会绕过宿主的
        // logger，调用方关不掉、诊断层也收不到。
        .catch(error => logger?.error?.(
          `[Sandbox] Evidence script injection failed: ${sourceUrl}`,
          error,
        ));
    };
    observer = realm.evaluate(`(() => {
      const bridge = globalThis[${JSON.stringify(bridgeName)}];
      const observer = new MutationObserver(records => {
        for (const record of records) {
          const addedNodes = record.addedNodes;
          for (let nodeIndex = 0; nodeIndex in Object(addedNodes); nodeIndex += 1) {
            const node = addedNodes[nodeIndex];
            const scripts = [];
            if (node && node.localName === 'script') scripts.push(node);
            const descendants = node?.getElementsByTagName?.('script');
            for (let childIndex = 0; childIndex in Object(descendants); childIndex += 1) {
              scripts.push(descendants[childIndex]);
            }
            for (const script of scripts) {
              bridge(script.src || script.getAttribute('src') || '');
            }
          }
        }
      });
      observer.observe(document, { childList: true, subtree: true });
      return observer;
    })()`);
  }
  
  for (const scriptId of scriptIds) {
    const source_ = await source.readText(scriptId);
    const url = new URL(scriptId, pageUrl).href;
    injector.registerScript(url, source_, {
      strategy: SCRIPT_LOAD_STRATEGY.ASYNC,
      async: true,
      element: createScriptElement(realm, url),
    });
  }
  await injector.waitForAllScripts();
  const failures = injector.getErrors();
  if (failures.length > 0) {
    observer.disconnect?.();
    injector.dispose();
    throw new Error(
      `Evidence script failed: ${failures[0].url}: ${failures[0].error?.message ?? failures[0].error}`,
      { cause: failures[0].error },
    );
  }
  return {
    injector,
    observer,
    dispose() {
      observer.disconnect?.();
      injector.dispose();
      try {
        delete realm.global[bridgeName];
      } catch {
        realm.global[bridgeName] = undefined;
      }
    },
  };
}

function serviceWorkerScopeMatches(scope, url) {
  let scopeUrl;
  let targetUrl;
  try {
    scopeUrl = new URL(scope);
    targetUrl = new URL(url);
  } catch {
    return false;
  }
  if (scopeUrl.origin !== targetUrl.origin) return false;
  const path = scopeUrl.pathname.endsWith('/')
    ? scopeUrl.pathname
    : `${scopeUrl.pathname}/`;
  return targetUrl.pathname === scopeUrl.pathname
    || targetUrl.pathname.startsWith(path);
}

function decodeNavigationBody(body) {
  if (typeof body === 'string') return body;
  if (body instanceof Uint8Array) {
    return new TextDecoder().decode(body);
  }
  if (ArrayBuffer.isView(body)) {
    return new TextDecoder().decode(
      new Uint8Array(body.buffer, body.byteOffset, body.byteLength),
    );
  }
  if (body instanceof ArrayBuffer) {
    return new TextDecoder().decode(new Uint8Array(body));
  }
  return `${body}`;
}

function scopeNetworkRecorder(recorder, kind, url) {
  if (recorder === null || recorder === undefined) return null;
  if (typeof recorder.record !== 'function') return null;
  return {
    record(entry) {
      recorder.record({
        ...entry,
        realm: {
          kind,
          url: `${url}`,
        },
      });
    },
  };
}

function createWorkerReplayState(replay) {
  const records = replay.map((entry, index) => ({
    ...entry,
    method: `${entry.method ?? 'GET'}`.toUpperCase(),
    url: `${entry.url}`,
    repeat: entry.repeat ?? 'once',
    sequence: entry.sequence,
    index,
    used: 0,
  }));
  return {
    records,
    enforceSequence: records.some(record => record.sequence !== undefined),
    sequenceCursor: 0,
  };
}

function resolveCoreWorkerSource(url, replayState) {
  const parsed = new URL(`${url}`);
  if (parsed.protocol === 'data:') {
    const comma = parsed.href.indexOf(',');
    if (comma < 0) throw new TypeError('Invalid data worker URL');
    const metadata = parsed.href.slice(5, comma);
    const payload = parsed.href.slice(comma + 1);
    if (metadata.toLowerCase().endsWith(';base64')) {
      return Buffer.from(payload, 'base64').toString('utf8');
    }
    try {
      return decodeURIComponent(payload);
    } catch {
      throw new TypeError('Invalid percent encoding in data worker URL');
    }
  }
  const candidates = replayState.records.filter(record => (
    record.method === 'GET' && record.url === parsed.href
  ));
  let available = false;
  let sequenceMismatch = false;
  for (const record of candidates) {
    if (!workerReplayRecordAvailable(record)) continue;
    available = true;
    if (
      replayState.enforceSequence
      && record.sequence !== undefined
      && record.sequence !== replayState.sequenceCursor
    ) {
      sequenceMismatch = true;
      continue;
    }
    record.used += 1;
    if (replayState.enforceSequence && record.sequence !== undefined) {
      replayState.sequenceCursor += 1;
    }
    return `${record.body ?? ''}`;
  }
  const reason = candidates.length === 0
    ? 'missing'
    : sequenceMismatch
      ? 'sequence-mismatch'
      : available
        ? 'unavailable'
        : 'exhausted';
  const details = Object.freeze({
    api: 'WorkerScript',
    method: 'GET',
    url: parsed.href,
    reason,
    sequence: replayState.enforceSequence
      ? replayState.sequenceCursor
      : undefined,
    candidates: Object.freeze(candidates.map(record => Object.freeze({
      index: record.index,
      repeat: record.repeat,
      sequence: record.sequence,
      used: record.used,
    }))),
  });
  const error = new TypeError(
    `Offline replay miss for worker script ${parsed.href}: ${reason}`,
  );
  error.code = 'ERR_NV8_WORKER_REPLAY_MISS';
  error.details = details;
  throw error;
}

function workerReplayRecordAvailable(record) {
  if (record.repeat === 'unlimited') return true;
  if (record.repeat === 'once' || record.repeat === undefined) {
    return record.used < 1;
  }
  const limit = Number(record.repeat);
  return Number.isSafeInteger(limit) && limit >= 0
    ? record.used < limit
    : record.used < 1;
}

async function evaluateCoreWorkletModule(
  realm,
  source,
  url,
  replayState,
  timeoutMs = 5000,
  moduleCache = null,
) {
  const modules = new Map();
  const origin = new URL(url).origin;
  const createModule = (moduleSource, moduleUrl) => {
    // 已求值的模块实例跨 addModule 复用：link() 拿到已求值实例不会再次执行
    // 模块体，registerPaint 等一次性注册副作用才不会重复触发（F18）。
    const reused = moduleCache?.get(moduleUrl);
    if (reused !== undefined) return reused;
    const module = new vm.SourceTextModule(moduleSource, {
      context: realm.context,
      identifier: moduleUrl,
      initializeImportMeta(meta) {
        meta.url = moduleUrl;
      },
      importModuleDynamically() {
        throw new TypeError('Dynamic Worklet imports are unavailable.');
      },
    });
    modules.set(moduleUrl, module);
    return module;
  };

  const root = createModule(source, url);
  await root.link(async (specifier, referencingModule) => {
    const referrer = referencingModule?.identifier ?? url;
    let resolved;
    try {
      resolved = new URL(`${specifier}`, referrer);
    } catch {
      throw new TypeError(`Worklet module import is invalid: ${specifier}`);
    }
    if (resolved.origin !== origin) {
      throw new TypeError(
        `Worklet module import must use the creator's origin: ${resolved.href}`,
      );
    }
    const resolvedUrl = resolved.href;
    const cached = modules.get(resolvedUrl);
    if (cached !== undefined) return cached;
    return createModule(
      resolveCoreWorkerSource(resolvedUrl, replayState),
      resolvedUrl,
    );
  });
  await evaluateModuleWithTimeout(root, timeoutMs, url);
  // 求值成功后才把模块图登记进缓存：失败图里的半求值模块不能被后续
  // addModule 复用（副作用状态不明），失败路径由调用方销毁整个 worklet。
  if (moduleCache !== null) {
    for (const [moduleUrl, module] of modules) moduleCache.set(moduleUrl, module);
  }
}

async function evaluateModuleWithTimeout(module, timeoutMs, url) {
  // evaluate({timeout}) 只限同步执行；顶层 await 挂起由墙钟期限兜底。
  await evaluateWithDeadline(module, timeoutMs, url);
}

async function evaluateCoreWorkerSource(
  realm,
  source,
  type,
  url,
  replayState,
  timeoutMs = 5000,
) {
  if (type === 'module') {
    const modules = new Map();
    const sourceEntries = new Map([[url, source]]);
    const moduleOrigin = new URL(url).origin;
    const load = async (specifier, referencingModule) => {
      const resolved = new URL(`${specifier}`, referencingModule?.identifier ?? url);
      if (resolved.origin !== moduleOrigin) {
        const error = new TypeError(
          `Worker module import must use the worker origin: ${resolved.href}`,
        );
        error.code = 'ERR_NV8_WORKER_MODULE_ORIGIN';
        throw error;
      }
      const resolvedUrl = resolved.href;
      const existing = modules.get(resolvedUrl);
      if (existing !== undefined) return existing;
      const importedSource = resolveCoreWorkerSource(resolvedUrl, replayState);
      sourceEntries.set(resolvedUrl, importedSource);
      const imported = new vm.SourceTextModule(importedSource, {
        context: realm.global,
        identifier: resolvedUrl,
        initializeImportMeta(meta) {
          meta.url = resolvedUrl;
        },
        importModuleDynamically() {
          throw new TypeError('Dynamic worker imports are unavailable.');
        },
      });
      modules.set(resolvedUrl, imported);
      return imported;
    };
    const module = new vm.SourceTextModule(source, {
      context: realm.global,
      identifier: url,
      initializeImportMeta(meta) {
        meta.url = url;
      },
      importModuleDynamically() {
        throw new TypeError('Dynamic worker imports are unavailable.');
      },
    });
    modules.set(url, module);
    await module.link(load);
    // 同步预算 + 墙钟期限双层：死循环与永不完成的顶层 await 都必须在
    // limits.timeoutMs 内终止（IKF39K）。
    await evaluateModuleWithTimeout(module, timeoutMs, url);
    return createModuleGraphVersion(sourceEntries);
  }
  const script = new vm.Script(source, { filename: url });
  // 经典 Worker 脚本与 evaluate 路径对齐：死循环必须在 limits.timeoutMs
  // 内被终止（IKF39K）。
  script.runInContext(realm.global, { timeout: timeoutMs, displayErrors: true });
  return createModuleGraphVersion(new Map([[url, source]]));
}

/** 计算 worker 模块图的版本摘要：URL 与源码逐项进 SHA-256。 */
function createModuleGraphVersion(sourceEntries) {
  const hash = createHash('sha256');
  for (const [url, source] of [...sourceEntries].sort(([left], [right]) => (
    left < right ? -1 : left > right ? 1 : 0
  ))) {
    hash.update(url);
    hash.update('\0');
    hash.update(source);
    hash.update('\0');
  }
  return hash.digest('hex');
}

/**
 * 创建一个兼容旧插件的全局 surface registry。
 */
function createSurfaceRegistry() {
  const surfaces = new Map();
  return {
    reserveGlobalSurface(owner, name) {
      const existingOwner = surfaces.get(name);
      if (existingOwner !== undefined && existingOwner !== owner) {
        throw new Error(
          `Global surface '${name}' is already reserved by '${existingOwner}'`,
        );
      }
      surfaces.set(name, owner);
    },
    hasGlobalSurface(name) {
      return surfaces.has(name);
    },
    listGlobalSurfaces() {
      return Array.from(surfaces, ([name, owner]) => ({ name, owner }));
    },
  };
}

/**
 * Worker / ServiceWorker / SharedWorker / Worklet Realm 工厂（IKF3A7(a)）。
 *
 * 原先是 `createSandbox` 内的嵌套闭包；这里按 deps 对象收口实时状态：
 * - `lifecycleState` 是**读数器**而不是值：destroy/reset 会推进 generation 并
 *   置 closed，工厂必须在每个 await 边界后重新读取，不能持有值拷贝。
 * - 容器（realms / workerRealms / sharedWorkerRecords / ...）按引用传入并在
 *   原处增删，语义与原闭包一致。
 * - 交叉引用（workerFactory / sharedWorkerFactory / workletFactory 互相注入）
 *   在本工厂作用域内直接可见，不需要额外接线。
 *
 * @param {object} deps
 * @returns {{disposeSharedWorkerRecords: Function, interceptServiceWorkerFetch: Function,
 *   createDedicatedWorker: Function, createServiceWorker: Function,
 *   createSharedWorkerConnection: Function, createWorkletModule: Function,
 *   destroyWorkerRealm: Function}}
 */
function createWorkerRealmFactories({
  sandboxId,
  profile,
  pluginInstances,
  stateRegistry,
  globals,
  trace,
  logger,
  replay,
  limits,
  runtime,
  broadcastConnector,
  workerReplayState,
  lifecycleState,
  realms,
  workerRealms,
  sharedWorkerRecords,
  sharedWorkerCreations,
  workletRealmsByOwner,
  workletRealms,
  serviceWorkerHandles,
  reserveWorker,
  reserveRealmCapacity,
  reserveWorkerConnection,
  trackWorkerConnection,
  releaseWorkerConnections,
  getServiceWorkerClients,
  notifyServiceWorkerClients,
}) {
  function disposeSharedWorkerRecords() {
    for (const record of new Set(sharedWorkerRecords.values())) {
      for (const connection of [...record.connections]) {
        connection.close?.();
      }
      record.connections.clear();
      destroyWorkerRealm(record.realm);
    }
    sharedWorkerRecords.clear();
  }

  function interceptServiceWorkerFetch(request) {
    let selected = null;
    for (const [scope, handle] of serviceWorkerHandles) {
      if (!serviceWorkerScopeMatches(scope, request.url)) continue;
      if (selected === null || scope.length > selected.scope.length) {
        selected = { scope, handle };
      }
    }
    return selected === null ? null : selected.handle.fetch(request);
  }

  async function createDedicatedWorker(options) {
    const generation = lifecycleState.generation;
    const source = resolveCoreWorkerSource(options.url, workerReplayState);
    const reservation = reserveWorker(options.workerDepth, true);
    let version = createHash('sha256').update(source).digest('hex');
    const workerNavigatorProfile = {
      ...(profile.navigator || {}),
      languages: profile.navigator?.languages || ['en-US', 'en'],
      language: profile.navigator?.language || 'en-US',
    };
    let workerRealm;
    let releaseRealm = () => {};
    try {
      releaseRealm = reserveRealmCapacity();
      workerRealm = await createRealm({
        sandboxId,
        type: 'worker',
        plugins: pluginInstances,
        stateRegistry,
        globals,
        trace,
        logger,
        pageUrl: options.url,
        pageHtml: '',
        replay,
        navigatorProfile: workerNavigatorProfile,
        timingProfile: profile.timing || null,
        workerDepth: reservation.depth,
        runtime: {
          ...runtime,
          workerDepth: reservation.depth,
          workerFactory: createDedicatedWorker,
          sharedWorkerFactory: createSharedWorkerConnection,
          workletFactory: createWorkletModule,
          broadcastConnector,
          networkRequestRecorder: scopeNetworkRecorder(
            runtime.networkRequestRecorder,
            'worker',
            options.url,
          ),
          workerGlobal: {
            kind: 'dedicated',
            name: `${options.name ?? ''}`,
            url: options.url,
            type: options.type,
            replay,
            navigatorProfile: workerNavigatorProfile,
            renderingProfile: profile.rendering ?? null,
            postMessage(message, ports) {
              options.onMessage?.(message, ports);
            },
            close() {
              reservation.releaseConnection();
              destroyWorkerRealm(workerRealm);
            },
          },
        },
      });
    } catch (error) {
      reservation.releaseConnection();
      reservation.releasePending();
      throw error;
    } finally {
      releaseRealm();
    }
    reservation.releasePending();
    if (lifecycleState.closed || generation !== lifecycleState.generation) {
      reservation.releaseConnection();
      destroyWorkerRealm(workerRealm);
      throw createWorkerLifecycleError();
    }
    realms.set(workerRealm.id, workerRealm);
    workerRealms.add(workerRealm);
    trackWorkerConnection(workerRealm, reservation.releaseConnection);
    try {
      version = await evaluateCoreWorkerSource(
        workerRealm,
        source,
        options.type,
        options.url,
        workerReplayState,
        limits.timeoutMs ?? 5000,
      ) ?? version;
    } catch (error) {
      destroyWorkerRealm(workerRealm);
      reservation.releaseConnection();
      throw error;
    }
    const workerRuntime = workerRealm.moduleLoader
      .importUrlSyncCached(WORKER_GLOBAL_RUNTIME_URL)?.namespace;
    return {
      version,
      deliverOwnerMessage(message, transferOptions, ports) {
        if (workerRealm.destroyed) return;
        workerRuntime?.receiveOwnerMessage?.(message, transferOptions, ports);
      },
      terminate() {
        reservation.releaseConnection();
        destroyWorkerRealm(workerRealm);
      },
    };
  }

  async function createServiceWorker(options) {
    const generation = lifecycleState.generation;
    const workerScope = options.scope ?? new URL('./', options.url).href;
    const activeHandle = { current: null };
    const source = resolveCoreWorkerSource(options.url, workerReplayState);
    const reservation = reserveWorker(options.workerDepth, false);
    let version = createHash('sha256').update(source).digest('hex');
    const workerNavigatorProfile = {
      ...(profile.navigator || {}),
      languages: profile.navigator?.languages || ['en-US', 'en'],
      language: profile.navigator?.language || 'en-US',
    };
    let workerRealm;
    let releaseRealm = () => {};
    try {
      releaseRealm = reserveRealmCapacity();
      workerRealm = await createRealm({
        sandboxId,
        type: 'worker',
        plugins: pluginInstances,
        stateRegistry,
        globals,
        trace,
        logger,
        pageUrl: options.url,
        pageHtml: '',
        replay,
        navigatorProfile: workerNavigatorProfile,
        timingProfile: profile.timing || null,
        workerDepth: reservation.depth,
        runtime: {
          ...runtime,
          workerDepth: reservation.depth,
          workerFactory: createDedicatedWorker,
          sharedWorkerFactory: createSharedWorkerConnection,
          workletFactory: createWorkletModule,
          serviceWorkerFactory: null,
          broadcastConnector,
          networkRequestRecorder: scopeNetworkRecorder(
            runtime.networkRequestRecorder,
            'service-worker',
            options.url,
          ),
          workerGlobal: {
            kind: 'service',
            name: '',
            url: options.url,
            type: options.type,
            replay,
            navigatorProfile: workerNavigatorProfile,
            renderingProfile: profile.rendering ?? null,
            postMessage(message, ports) {
              options.onMessage?.(message, ports);
            },
            close() {
              reservation.releaseConnection();
              destroyWorkerRealm(workerRealm);
            },
            serviceWorkerControl: {
              skipWaiting() {
                options.onSkipWaiting?.();
              },
              claim() {
                options.onClaim?.();
              },
              hasClient() {
                return getServiceWorkerClients({
                  scope: workerScope,
                  handle: activeHandle.current,
                }).length > 0;
              },
              matchAll(options = {}) {
                return getServiceWorkerClients({
                  ...options,
                  scope: options.includeUncontrolled === true ? null : workerScope,
                  handle: activeHandle.current,
                });
              },
            },
          },
        },
      });
    } catch (error) {
      reservation.releaseConnection();
      reservation.releasePending();
      throw error;
    } finally {
      releaseRealm();
    }
    reservation.releasePending();
    if (lifecycleState.closed || generation !== lifecycleState.generation) {
      reservation.releaseConnection();
      destroyWorkerRealm(workerRealm);
      throw createWorkerLifecycleError();
    }
    realms.set(workerRealm.id, workerRealm);
    workerRealms.add(workerRealm);
    trackWorkerConnection(workerRealm, reservation.releaseConnection);
    const workerRuntime = workerRealm.moduleLoader
      .importUrlSyncCached(WORKER_GLOBAL_RUNTIME_URL)?.namespace;
    try {
      options.onState?.('installing');
      const evaluatedVersion = await evaluateCoreWorkerSource(
        workerRealm,
        source,
        options.type,
        options.url,
        workerReplayState,
        limits.timeoutMs ?? 5000,
      );
      version = evaluatedVersion ?? version;
      await workerRuntime?.dispatchServiceWorkerLifecycle?.('install');
      options.onState?.('installed');
      if (options.activate !== false) options.onState?.('activating');
    } catch (error) {
      destroyWorkerRealm(workerRealm);
      reservation.releaseConnection();
      throw error;
    }
    let activationPromise = null;
    const handle = {
      scriptURL: options.url,
      scope: workerScope,
      version,
      // 生命周期只读视图：让 findServiceWorkerController / 客户端快照
      // 能识别已终止的 handle（IKFD9G）。
      get destroyed() {
        return workerRealm.destroyed === true;
      },
      get realm() {
        return workerRealm;
      },
      deliverOwnerMessage(message, transferOptions, ports) {
        if (workerRealm.destroyed) return;
        workerRuntime?.receiveOwnerMessage?.(message, transferOptions, ports);
      },
      fetch(request) {
        if (workerRealm.destroyed) return null;
        return workerRuntime?.dispatchServiceWorkerFetch?.(request) ?? null;
      },
      activate() {
        if (activationPromise !== null) return activationPromise;
        activationPromise = (async () => {
          if (workerRealm.destroyed) return;
          await workerRuntime?.dispatchServiceWorkerLifecycle?.('activate');
          if (workerRealm.destroyed) return;
          options.onState?.('activated');
          serviceWorkerHandles.set(workerScope, handle);
          notifyServiceWorkerClients(workerScope, handle);
        })();
        return activationPromise;
      },
      terminate(options = {}) {
        for (const [scope, candidate] of serviceWorkerHandles) {
          if (candidate === handle) serviceWorkerHandles.delete(scope);
        }
        if (options.replacing !== true) {
          notifyServiceWorkerClients(workerScope, null);
        }
        reservation.releaseConnection();
        destroyWorkerRealm(workerRealm);
      },
    };
    activeHandle.current = handle;
    if (options.activate !== false) {
      serviceWorkerHandles.set(workerScope, handle);
      notifyServiceWorkerClients(workerScope, handle);
    }
    return handle;
  }

  async function createSharedWorkerConnection(options) {
    const generation = lifecycleState.generation;
    const key = `${options.creatorOrigin}\0${options.url}\0${options.name}`;
    let record = sharedWorkerRecords.get(key);
    // 复用前先检查 record 生命周期：worker 侧 self.close() / 生命周期销毁
    // 之后残留的 record 不合法，必须重建（IKFD9H）。
    if (record !== undefined && record.realm?.destroyed === true) {
      sharedWorkerRecords.delete(key);
      record = undefined;
    }
    const source = record === undefined
      ? resolveCoreWorkerSource(options.url, workerReplayState)
      : null;
    const releaseConnection = reserveWorkerConnection(options.workerDepth);
    if (record === undefined) {
      // 并发 new SharedWorker(同 key)：第一个调用者负责创建，其余等待同一个
      // in-flight promise。否则两个调用者会各自建一个全局作用域（IKFD9H）。
      let creation = sharedWorkerCreations.get(key);
      if (creation === undefined) {
        creation = createSharedWorkerRecord(key, options, source, generation);
        sharedWorkerCreations.set(key, creation);
        void creation.finally(() => {
          if (sharedWorkerCreations.get(key) === creation) {
            sharedWorkerCreations.delete(key);
          }
        }).catch(() => {});
      }
      try {
        record = await creation;
      } catch (error) {
        releaseConnection();
        throw error;
      }
    }
    if (lifecycleState.closed || generation !== lifecycleState.generation) {
      releaseConnection();
      throw createWorkerLifecycleError();
    }
    let connection;
    try {
      connection = record.runtime?.connectSharedWorker?.(
        (message, ports) => options.onMessage?.(message, ports),
      ) ?? { deliverOwnerMessage() {}, close() {} };
    } catch (error) {
      releaseConnection();
      throw error;
    }
    record.connections.add(connection);
    trackWorkerConnection(record.realm, releaseConnection);
    return {
      deliverOwnerMessage(message, ports) {
        if (!record.realm.destroyed) connection.deliverOwnerMessage(message, ports);
      },
      close() {
        releaseConnection();
        connection.close();
        record.connections.delete(connection);
        if (record.connections.size === 0) {
          for (const [candidateKey, candidate] of sharedWorkerRecords) {
            if (candidate === record) sharedWorkerRecords.delete(candidateKey);
          }
          destroyWorkerRealm(record.realm);
        }
      },
    };
  }

  /**
   * 创建 SharedWorker 全局作用域（record）。调用方通过
   * `sharedWorkerCreations` 做同 key 互斥，本函数自身不查缓存。
   */
  async function createSharedWorkerRecord(key, options, source, generation) {
    let workerRealm;
    let reservation;
    try {
      reservation = reserveWorker(options.workerDepth, false);
    } catch (error) {
      throw error;
    }
    const workerNavigatorProfile = {
      ...(profile.navigator || {}),
      languages: profile.navigator?.languages || ['en-US', 'en'],
      language: profile.navigator?.language || 'en-US',
    };
    let releaseRealm = () => {};
    try {
      releaseRealm = reserveRealmCapacity();
      workerRealm = await createRealm({
        sandboxId,
        type: 'worker',
        plugins: pluginInstances,
        stateRegistry,
        globals,
        trace,
        logger,
        pageUrl: options.url,
        pageHtml: '',
        replay,
        navigatorProfile: workerNavigatorProfile,
        timingProfile: profile.timing || null,
        workerDepth: reservation.depth,
        runtime: {
          ...runtime,
          workerDepth: reservation.depth,
          workerFactory: createDedicatedWorker,
          sharedWorkerFactory: createSharedWorkerConnection,
          workletFactory: createWorkletModule,
          broadcastConnector,
          networkRequestRecorder: scopeNetworkRecorder(
            runtime.networkRequestRecorder,
            'shared-worker',
            options.url,
          ),
          workerGlobal: {
            kind: 'shared',
            name: `${options.name ?? ''}`,
            url: options.url,
            type: options.type,
            replay,
            navigatorProfile: workerNavigatorProfile,
            renderingProfile: profile.rendering ?? null,
            postMessage: null,
            close() {
              // worker 侧 self.close()：作废 record，后续同 key 的
              // new SharedWorker 必须重建而不是复用死掉的 realm。
              const current = sharedWorkerRecords.get(key);
              if (current !== undefined && current.realm === workerRealm) {
                sharedWorkerRecords.delete(key);
              }
              destroyWorkerRealm(workerRealm);
            },
          },
        },
      });
    } catch (error) {
      reservation.releasePending();
      throw error;
    } finally {
      releaseRealm();
    }
    reservation.releasePending();
    if (lifecycleState.closed || generation !== lifecycleState.generation) {
      destroyWorkerRealm(workerRealm);
      throw createWorkerLifecycleError();
    }
    realms.set(workerRealm.id, workerRealm);
    workerRealms.add(workerRealm);
    try {
      await evaluateCoreWorkerSource(
        workerRealm,
        source,
        options.type,
        options.url,
        workerReplayState,
        limits.timeoutMs ?? 5000,
      );
    } catch (error) {
      destroyWorkerRealm(workerRealm);
      throw error;
    }
    const record = {
      realm: workerRealm,
      runtime: workerRealm.moduleLoader
        .importUrlSyncCached(WORKER_GLOBAL_RUNTIME_URL)?.namespace,
      connections: new Set(),
    };
    sharedWorkerRecords.set(key, record);
    return record;
  }

  async function createWorkletModule(options) {
    let realmsForOwner = workletRealmsByOwner.get(options.owner);
    if (realmsForOwner === undefined) {
      realmsForOwner = new Map();
      workletRealmsByOwner.set(options.owner, realmsForOwner);
    }
    const key = `${options.kind}\0${options.id}`;
    let entry = realmsForOwner.get(key);
    // 已销毁的 Realm 不能被复用（reset/destroy 会清空 workletRealms，
    // 但 WeakMap 里可能还留着指向已销毁句柄的 entry）。
    if (entry !== undefined && entry.realm?.destroyed) {
      realmsForOwner.delete(key);
      entry = undefined;
    }
    if (entry === undefined) {
      const generation = lifecycleState.generation;
      const releaseRealm = reserveRealmCapacity();
      const createdEntry = {
        realm: null,
        modules: new Map(),
        chain: Promise.resolve(),
        creating: null,
      };
      // 同 key 并发创建只保留一个 Realm：创建 promise 先入表，后来者等待
      // 同一个 promise，而不是各自建一个后互相覆盖（泄漏前者）。
      createdEntry.creating = (async () => {
        try {
          const workletRealm = await createWorkletRealm({
            label: `sandbox-${sandboxId}-${options.kind}-worklet-${options.id}`,
            kind: options.kind,
            origin: options.creatorOrigin,
            traceEnabled: trace,
            maxTraceEntries: 100_000,
            objectURLRegistry: null,
          });
          if (lifecycleState.closed || generation !== lifecycleState.generation) {
            destroyWorkletRealm(workletRealm);
            throw createRealmLifecycleError();
          }
          createdEntry.realm = workletRealm;
          workletRealms.add(workletRealm);
          return workletRealm;
        } finally {
          releaseRealm();
        }
      })().catch(error => {
        if (realmsForOwner.get(key) === createdEntry) realmsForOwner.delete(key);
        throw error;
      });
      realmsForOwner.set(key, createdEntry);
      entry = createdEntry;
    }
    const workletRealm = entry.realm ?? await entry.creating;

    // Worklet Realm 级模块缓存：同一 owner 的多个 addModule 入口共享依赖时，
    // 依赖模块只能求值一次（registerPaint 等注册副作用是全局的，重复执行
    // 会在真实浏览器里直接抛 NotSupportedError）。并发 addModule 通过 per-Realm
    // 队列串行：后到者在前者完成后重新检查缓存，共享依赖只求值一次（F-E3）。
    if (entry.modules.has(options.url)) return;
    const previous = entry.chain ?? Promise.resolve();
    const task = previous.catch(() => {}).then(async () => {
      if (entry.modules.has(options.url)) return;
      const source = resolveCoreWorkerSource(options.url, workerReplayState);
      await evaluateCoreWorkletModule(
        workletRealm,
        source,
        options.url,
        workerReplayState,
        limits.timeoutMs ?? 5000,
        entry.modules,
      );
    });
    entry.chain = task.catch(() => {});
    try {
      await task;
    } catch (error) {
      // 评估失败且该 worklet 尚无任何成功模块时，销毁整个 worklet；
      // 已有成功模块时保留 Realm（浏览器里单次 addModule 失败不会撤销
      // 之前注册的模块），失败 URL 不进缓存、可重试。
      if (entry.modules.size === 0) {
        if (realmsForOwner.get(key) === entry) realmsForOwner.delete(key);
        workletRealms.delete(workletRealm);
        destroyWorkletRealm(workletRealm);
      }
      throw error;
    }
  }

  function destroyWorkerRealm(workerRealm) {
    if (!workerRealm || workerRealm.destroyed) return;
    workerRealm.destroyed = true;
    releaseWorkerConnections(workerRealm);
    void workerRealm.destroy();
    realms.delete(workerRealm.id);
    workerRealms.delete(workerRealm);
    stateRegistry.destroyContext('realm', workerRealm.id);
  }

  return {
    disposeSharedWorkerRecords,
    interceptServiceWorkerFetch,
    createDedicatedWorker,
    createServiceWorker,
    createSharedWorkerConnection,
    createWorkletModule,
    destroyWorkerRealm,
  };
}

/**
 * iframe / root 文档替换工厂（IKF3A7(a)）。
 *
 * 与 worker 工厂同样的 deps 约定；额外依赖：
 * - `rootRealm`：root realm id 的可变持有者（replaceRootWindowClient 会更新它）。
 * - `counter.nextClientId()`：window client id 游标。
 * - `workers`：worker 工厂返回的创建/销毁句柄（iframe 与 root 的 runtime 需要
 *   把它们注入子 Realm）。
 * - `interceptFetch`：ServiceWorker 请求拦截（worker 工厂提供）。
 *
 * @param {object} deps
 * @returns {{createIframeChildRealm: Function, replaceRootWindowClient: Function}}
 */
function createWindowRealmFactories({
  sandboxId,
  profile,
  pluginInstances,
  stateRegistry,
  globals,
  trace,
  logger,
  replay,
  limits,
  runtime,
  broadcastConnector,
  lifecycleState,
  realms,
  windowClients,
  serviceWorkerContainers,
  evidenceResources,
  evidenceSource,
  evidence,
  lifecycle,
  rootRealm,
  counter,
  findServiceWorkerController,
  getServiceWorkerClients,
  interceptFetch,
  workers,
  reserveRealmCapacity,
}) {
  const {
    createDedicatedWorker,
    createServiceWorker,
    createSharedWorkerConnection,
    createWorkletModule,
  } = workers;

  async function createIframeChildRealm(options) {
    if (lifecycleState.closed || options.isOwnerActive?.() === false) throw createRealmLifecycleError();
    const generation = lifecycleState.generation;
    const releaseRealm = reserveRealmCapacity();
    let childRealm;
    try {
    const childUrl = new URL(options.pageUrl || profile.url || 'https://example.com/');
    const childOrigin = options.origin ?? childUrl.origin;
    const serviceWorkerPageUrl = options.serviceWorkerPageUrl ?? childUrl.href;
    const serviceWorkerController = findServiceWorkerController(serviceWorkerPageUrl);
    let pageHtml = options.pageHtml
      ?? '<!doctype html><html><head></head><body></body></html>';
    if (options.navigationSource === 'src') {
      const navigationResponse = await interceptFetch({
        method: 'GET',
        url: childUrl.href,
        headers: { accept: 'text/html' },
        body: null,
      });
      if (lifecycleState.closed || generation !== lifecycleState.generation) {
        throw createRealmLifecycleError();
      }
      if (navigationResponse?.body !== undefined) {
        pageHtml = decodeNavigationBody(navigationResponse.body);
      }
    }
    childRealm = await createRealm({
      sandboxId,
      type: 'iframe',
      plugins: pluginInstances,
      stateRegistry,
      globals,
      trace,
      logger,
      pageUrl: childUrl.href,
      origin: childOrigin,
      documentBaseUrl: options.documentBaseUrl ?? childUrl.href,
      serviceWorkerPageUrl,
      pageHtml,
      replay: options.replay ?? replay,
      navigatorProfile: options.navigatorProfile ?? profile.navigator ?? {},
      timingProfile: options.timingProfile ?? profile.timing ?? null,
      limits,
      runtime: {
        ...runtime,
        ...(options.runtime || {}),
        serviceWorkerPageUrl,
        documentBaseUrl: options.documentBaseUrl ?? childUrl.href,
        childRealmFactory: createIframeChildRealm,
        workerDepth: 0,
        workerFactory: createDedicatedWorker,
        sharedWorkerFactory: createSharedWorkerConnection,
        serviceWorkerFactory: createServiceWorker,
        serviceWorkerFetch: interceptFetch,
        workletFactory: createWorkletModule,
        broadcastConnector,
        serviceWorkerProfile: {
          enabled: true,
          controller: serviceWorkerController,
          clients: options => getServiceWorkerClients(options),
          onControllerChange: snapshot => {
            const module = childRealm.moduleLoader.importUrlSyncCached(SERVICE_WORKER_RUNTIME_URL);
            module?.namespace?.updateServiceWorkerController?.(snapshot);
          },
        },
        windowContext: {
          origin: childOrigin,
          parentWindow: options.parentWindow ?? null,
          topWindow: options.topWindow ?? options.parentWindow ?? null,
          parentOrigin: options.parentOrigin ?? new URL(profile.url || childUrl.href).origin,
          parentPostMessage: options.parentPostMessage ?? null,
          sameOrigin: options.sameOrigin === true,
        },
      },
    });
    if (lifecycleState.closed || generation !== lifecycleState.generation || options.isOwnerActive?.() === false) {
      childRealm.destroyed = true;
      await childRealm.destroy().catch(() => {});
      throw createRealmLifecycleError();
    }
    realms.set(childRealm.id, childRealm);
    releaseRealm();
    const clientId = options.clientId ?? `window-client-${counter.nextClientId()}`;
    windowClients.set(childRealm.id, {
      id: clientId,
      realmId: childRealm.id,
      url: serviceWorkerPageUrl,
      frameType: 'nested',
      visibilityState: 'visible',
      focused: false,
      navigatePage: typeof options.navigatePage === 'function'
        ? options.navigatePage
        : null,
    });
    await completePageLifecycle(childRealm);
    if (lifecycleState.closed || generation !== lifecycleState.generation || childRealm.destroyed) {
      throw createRealmLifecycleError();
    }
    const childWindow = childRealm.evaluate('globalThis');
    options.onContext?.(childWindow);
    return {
      window: childWindow,
      origin: childOrigin,
      deliverParentMessage(message, origin, targetOriginOrOptions, transfer) {
        if (childRealm.destroyed) return;
        const module = childRealm.moduleLoader.importUrlSyncCached(WINDOW_CONTEXT_URL);
        module?.namespace?.receiveWindowContextMessage?.(
          message,
          origin,
          targetOriginOrOptions,
          transfer,
        );
      },
      clientId,
      canNavigate() {
        return childRealm.moduleLoader
          ?.importUrlSyncCached(PAGE_LIFECYCLE_URL)
          ?.namespace?.dispatchBeforeUnload?.() !== false;
      },
      close() {
        if (childRealm.destroyed) return;
        childRealm.moduleLoader
          .importUrlSyncCached(PAGE_LIFECYCLE_URL)
          ?.namespace?.dispatchPageHideAndUnload?.();
        childRealm.destroyed = true;
        void childRealm.destroy();
        realms.delete(childRealm.id);
        windowClients.delete(childRealm.id);
        serviceWorkerContainers.delete(childRealm.id);
        stateRegistry.destroyContext('realm', childRealm.id);
      },
    };
    } catch (error) {
      if (childRealm) {
        childRealm.destroyed = true;
        await childRealm.destroy().catch(() => {});
        realms.delete(childRealm.id);
        windowClients.delete(childRealm.id);
        serviceWorkerContainers.delete(childRealm.id);
      }
      throw error;
    } finally {
      releaseRealm();
    }
  }

  async function replaceRootWindowClient(
    oldRealm,
    oldClient,
    nextUrl,
    originalOptions,
    navigationOptions = {},
  ) {
    // 生命周期闸门：销毁/重置之后的导航（含页面定时器触发的延迟导航）
    // 一律拒绝，不得复活 Realm（IKFD9F）。
    if (lifecycleState.closed || oldRealm.destroyed) return null;
    const generation = lifecycleState.generation;
    if (
      navigationOptions.beforeUnloadChecked !== true
      && oldRealm.moduleLoader
        ?.importUrlSyncCached(PAGE_LIFECYCLE_URL)
        ?.namespace?.dispatchBeforeUnload?.() === false
    ) {
      return null;
    }
    const targetUrl = new URL(nextUrl).href;
    let pageHtml = '<!doctype html><html><head></head><body></body></html>';
    const navigationResponse = await interceptFetch({
      method: 'GET',
      url: targetUrl,
      headers: { accept: 'text/html' },
      body: null,
    });
    if (lifecycleState.closed || generation !== lifecycleState.generation || oldRealm.destroyed) {
      return null;
    }
    if (navigationResponse?.body !== undefined) {
      pageHtml = decodeNavigationBody(navigationResponse.body);
    }

    oldRealm.moduleLoader
      ?.importUrlSyncCached(PAGE_LIFECYCLE_URL)
      ?.namespace?.dispatchPageHideAndUnload?.();
    evidenceResources.get(oldRealm.id)?.dispose();
    evidenceResources.delete(oldRealm.id);
    oldRealm.destroyed = true;
    await oldRealm.destroy();
    realms.delete(oldRealm.id);
    windowClients.delete(oldRealm.id);
    serviceWorkerContainers.delete(oldRealm.id);
    stateRegistry.destroyContext('realm', oldRealm.id);
    if (rootRealm.id === oldRealm.id) rootRealm.id = null;

    const releaseRealm = reserveRealmCapacity();
    let replacement;
    try {
    replacement = await createRealm({
      sandboxId,
      type: 'root',
      plugins: pluginInstances,
      stateRegistry,
      globals,
      trace,
      logger,
      pageUrl: targetUrl,
      pageHtml,
      replay: originalOptions.replay ?? replay,
      navigatorProfile: originalOptions.navigatorProfile ?? profile.navigator ?? {},
      timingProfile: originalOptions.timingProfile ?? profile.timing ?? null,
      limits,
      runtime: {
        broadcastConnector,
        childRealmFactory: createIframeChildRealm,
        workerDepth: 0,
        windowContext: {
          origin: new URL(targetUrl).origin,
          sameOrigin: true,
        },
        workerFactory: createDedicatedWorker,
        sharedWorkerFactory: createSharedWorkerConnection,
        workletFactory: createWorkletModule,
        serviceWorkerFactory: createServiceWorker,
        serviceWorkerFetch: interceptFetch,
        beforeNavigate: () => replacement
          ?.moduleLoader
          ?.importUrlSyncCached(PAGE_LIFECYCLE_URL)
          ?.namespace?.dispatchBeforeUnload?.() !== false,
        onNavigate: ({ url }) => {
          if (replacement?.destroyed) return;
          void replaceRootWindowClient(
            replacement,
            oldClient,
            url,
            originalOptions,
            { beforeUnloadChecked: true },
          );
        },
        serviceWorkerProfile: {
          enabled: true,
          controller: findServiceWorkerController(targetUrl),
          clients: options => getServiceWorkerClients(options),
          onControllerChange: snapshot => {
            const module = replacement?.moduleLoader?.importUrlSyncCached(SERVICE_WORKER_RUNTIME_URL);
            module?.namespace?.updateServiceWorkerController?.(snapshot);
          },
        },
        ...runtime,
        ...(originalOptions.runtime || {}),
        networkRequestRecorder: scopeNetworkRecorder(
          originalOptions.runtime?.networkRequestRecorder
            ?? runtime.networkRequestRecorder,
          'window',
          targetUrl,
        ),
      },
    });
    if (lifecycleState.closed || generation !== lifecycleState.generation) {
      replacement.destroyed = true;
      await replacement.destroy().catch(() => {});
      throw createRealmLifecycleError();
    }
    if (evidenceSource !== null && evidence?.executeScripts === true) {
      const resource = await injectEvidenceScripts(
        replacement,
        evidenceSource,
        evidence,
        targetUrl,
        logger,
      );
      evidenceResources.set(replacement.id, resource);
    }
    if (lifecycleState.closed || generation !== lifecycleState.generation) {
      evidenceResources.get(replacement.id)?.dispose();
      evidenceResources.delete(replacement.id);
      replacement.destroyed = true;
      await replacement.destroy().catch(() => {});
      throw createRealmLifecycleError();
    }
    realms.set(replacement.id, replacement);
    releaseRealm();
    rootRealm.id = replacement.id;
    oldClient.realmId = replacement.id;
    oldClient.url = targetUrl;
    oldClient.navigatePage = value => replaceRootWindowClient(
      replacement,
      oldClient,
      value,
      originalOptions,
    );
    windowClients.set(replacement.id, oldClient);
    serviceWorkerContainers.set(replacement.id, replacement);
    await completePageLifecycle(replacement);
    lifecycle.emit('realm.navigation.completed', {
      sandboxId,
      previousRealmId: oldRealm.id,
      realmId: replacement.id,
      url: targetUrl,
    });
    return replacement;
    } catch (error) {
      if (replacement) {
        evidenceResources.get(replacement.id)?.dispose();
        evidenceResources.delete(replacement.id);
        replacement.destroyed = true;
        await replacement.destroy().catch(() => {});
        realms.delete(replacement.id);
        windowClients.delete(replacement.id);
        serviceWorkerContainers.delete(replacement.id);
      }
      if (rootRealm.id === oldRealm.id || rootRealm.id === replacement?.id) rootRealm.id = null;
      throw error;
    } finally {
      releaseRealm();
    }
  }


  return {
    createIframeChildRealm,
    replaceRootWindowClient,
  };
}

/**
 * TypeScript 类型定义
 * 
 * @typedef {Object} SandboxConfig
 * @property {string} appId - App ID
 * @property {Profile} profile - Profile 配置
 * @property {Plugin[]} plugins - 已解析的插件列表
 * @property {StateRegistry} stateRegistry - 状态注册表
 * @property {boolean} trace - 是否启用追踪
 * @property {Logger} logger - 日志工具
 * 
 * @typedef {Object} RealmOptions
 * @property {'root'|'worker'|'iframe'|'worklet'} [type] - Realm 类型
 * 
 * @typedef {Object} Sandbox
 * @property {string} id - Sandbox ID
 * @property {string} appId - App ID
 * @property {Profile} profile - Profile 配置
 * @property {Plugin[]} plugins - 已安装的插件
 * @property {function(RealmOptions): Promise<Realm>} createRealm
 * @property {function(string): Promise<void>} destroyRealm
 * @property {function(string): Realm} getRealm
 * @property {function(): Realm[]} getAllRealms
 * @property {function(string): boolean} hasCapability
 * @property {function(string): any} getCapability
 * @property {function(): string[]} getAllCapabilities
 * @property {function(string): any} getState
 * @property {function(string, any): void} setState
 * @property {function(): Promise<void>} destroy
 * @property {function(): Object} inspect
 */

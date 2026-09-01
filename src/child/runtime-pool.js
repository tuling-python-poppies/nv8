import vm from "node:vm";
import { Buffer } from "node:buffer";
import { isPromise } from "node:util/types";
import { setTimeout as hostDelay } from "node:timers/promises";
import { evaluationResult } from "../protocol/typed-values.js";
import { createRealm, createRealmShellAsync, activateRealmShell } from "../realm/create-realm.js";
import { createWorkerRealm } from "../realm/create-worker-realm.js";
import { createWorkletRealm } from "../realm/create-worklet-realm.js";
import {
  createDynamicImporter,
  rejectDynamicImport,
} from "../realm/dynamic-import.js";
import { destroyRealm } from "../realm/destroy-realm.js";
import { assertLiveRealm } from "../realm/realm-record.js";
import {
  NetworkRequestCapture,
} from "../network/network-request-capture.js";
import {
  loadEvidenceBundle,
} from "../evidence/loader.js";
import {
  createEvidenceSource,
} from "../evidence/evidence-source.js";
import {
  createScriptInjector,
  SCRIPT_LOAD_STRATEGY,
} from "../core/script-injector.js";
import {
  resolveTrustedScriptIds,
} from "../core/evidence-contract.js";

const ESTIMATED_FULL_REALM_HEAP_BYTES = 36 * 1024 * 1024;

// Module-level pre-warmed shell survives across RuntimePool instances.
let pendingShell = null;

// LRU script cache — vm.Script is context-independent, safe to reuse across realms.
const SCRIPT_CACHE = new Map();
const SCRIPT_CACHE_MAX = 256;

function getCachedScript(source) {
  let script = SCRIPT_CACHE.get(source);
  if (script) {
    // Move to end (most recently used)
    SCRIPT_CACHE.delete(source);
    SCRIPT_CACHE.set(source, script);
    return script;
  }
  script = new vm.Script(source, {
    filename: "eval",
    // eval 脚本没有稳定的 Realm 归属（SCRIPT_CACHE 跨 Realm 复用编译结果），
    // 因此这里无法绑定 per-Realm 的模块缓存。动态 import 在 eval 里保持拒绝；
    // 需要模块的场景应走 evaluateModule()。
    importModuleDynamically(specifier) {
      rejectDynamicImport(specifier, "cached eval scripts");
    },
  });
  if (SCRIPT_CACHE.size >= SCRIPT_CACHE_MAX) {
    // Evict oldest entry
    const oldest = SCRIPT_CACHE.keys().next().value;
    SCRIPT_CACHE.delete(oldest);
  }
  SCRIPT_CACHE.set(source, script);
  return script;
}

export class RuntimePool {
  constructor(options) {
    this.options = options;
    this.page = options.page;
    this.realm = null;
    this.evidenceSource = null;
    this.evidenceScriptInjector = null;
    this.evidenceScriptObserver = null;
    this.evidenceReplayEntries = null;
    this.traceEnabled = options.proxyTrace.enabled;
    this.networkRequestCapture = new NetworkRequestCapture(
      options.networkCapture,
      options.persistence?.networkCapture ?? null,
    );
    this.localStorageByOrigin = new Map(
      options.persistence?.localStorageByOrigin ?? [],
    );
    this.sessionStorageByOrigin = new Map(
      options.persistence?.sessionStorageByOrigin ?? [],
    );
    this.cookieData = options.persistence?.cookieData ?? "";
    this.childRealms = new Set();
    // 空白子 Realm 预热池，见 docs/adr/0004-dynamic-iframe-timing.md
    this.pendingRealmCreations = 0;
    this.generation = 0;
    this.closed = false;
    this.heapSafeRealmLimit = Math.max(
      1,
      Math.floor(
        options.limits.maxHeapBytes / ESTIMATED_FULL_REALM_HEAP_BYTES,
      ),
    );
    this.sharedWorkers = new Map();
    this.workletRealmsByOwner = new WeakMap();
    this.broadcastGroups = new Map();
    const nativeFunctions = new WeakMap();
    this.nativeFunctionRegistry = Object.freeze({
      register(callback, source) {
        if (
          typeof callback === "function"
          && typeof source === "string"
        ) {
          nativeFunctions.set(callback, source);
        }
      },
      has(callback) {
        return nativeFunctions.has(callback);
      },
      source(callback) {
        return nativeFunctions.get(callback);
      },
    });
    const blobRecords = new WeakMap();
    const objectURLRecords = new Map();
    this.objectURLRegistry = Object.freeze({
      registerBlob(value, bytes, type) {
        const copy = new Uint8Array(bytes.length);
        for (let index = 0; index < bytes.length; index += 1) {
          copy[index] = bytes[index];
        }
        blobRecords.set(value, {
          bytes: copy,
          type: `${type}`,
        });
      },
      hasBlob(value) {
        return blobRecords.has(value);
      },
      register(url, value) {
        if (objectURLRecords.has(url)) return false;
        const blob = blobRecords.get(value);
        if (blob === undefined) return false;
        objectURLRecords.set(url, {
          bytes: blob.bytes,
          type: blob.type,
          origin: new URL(url).origin,
        });
        return true;
      },
      revoke(url) {
        objectURLRecords.delete(url);
      },
      resolve(url) {
        return objectURLRecords.get(url);
      },
      clear() {
        objectURLRecords.clear();
      },
    });
  }

  async initialize() {
    await this.initializeEvidence();
    this.realm = await this.createRootRealm();
    await this.injectEvidenceScripts();
  }

  async initializeEvidence() {
    const evidence = this.options.evidence;
    if (!evidence) return;
    
    const bundle = await loadEvidenceBundle(evidence.bundlePath, {
      trustedScriptPolicy: evidence.trustedScriptPolicy,
    });
    // 往后的读取全部走抽象契约，不再直接触碰 Bundle 格式
    this.evidenceSource = createEvidenceSource(bundle);
    
    if (evidence.usePage) {
      await this.applyEvidencePage();
    }
    if (evidence.useNetworkReplay) {
      const fixture = await this.evidenceSource.getNetworkReplayFixture();
      if (fixture !== null) {
        this.evidenceReplayEntries = await createRuntimeReplayEntries(
          fixture,
          this.evidenceSource,
        );
      }
    }
    
    this.options = Object.freeze({
      ...this.options,
      page: this.page,
      replay: this.evidenceReplayEntries ?? this.options.replay,
    });
  }

  async applyEvidencePage() {
    const pages = (await this.evidenceSource?.listPages()) ?? [];
    if (pages.length === 0) return;
    const pageFile = pages[0];
    const html = await this.evidenceSource.readText(pageFile.id);
    if (Buffer.byteLength(html, "utf8") > this.options.limits.maxHtmlBytes) {
      throw new RangeError(
        `Evidence page exceeds limits.maxHtmlBytes: ${pageFile.id}`,
      );
    }
    this.page = Object.freeze({
      ...this.page,
      html,
    });
  }

  async injectEvidenceScripts() {
    const evidence = this.options.evidence;
    if (
      this.evidenceSource === null
      || evidence?.executeScripts !== true
      || this.realm === null
    ) {
      return;
    }
    
    // 策略判定统一交给契约层，避免两处实现不一致
    const scriptIds = await resolveTrustedScriptIds(this.evidenceSource, evidence);
    if (scriptIds.length === 0) return;
    
    const runtime = this;
    const scriptRealm = {
      evaluate(source, options = {}) {
        const script = new vm.Script(source, {
          filename: options.filename ?? "evidence-script",
        });
        const value = script.runInContext(runtime.realm.context);
        runtime.runScheduledTasks();
        return value;
      },
    };
    const injector = createScriptInjector(scriptRealm, {
      strategy: SCRIPT_LOAD_STRATEGY.ASYNC,
    });
    this.evidenceScriptInjector = injector;
    
    const resolveScriptSource = sourceUrl => (
      this.resolveEvidenceScriptSource(sourceUrl)
    );
    const document = vm.runInContext("typeof document === 'undefined' ? null : document", this.realm.context);
    const mutationObserver = vm.runInContext(
      "typeof MutationObserver === 'undefined' ? null : MutationObserver",
      this.realm.context,
    );
    if (document !== null && mutationObserver !== null) {
      this.evidenceScriptObserver = injector.observeScriptElements(
        document,
        resolveScriptSource,
        { MutationObserver: mutationObserver },
      );
    }
    
    for (const scriptId of scriptIds) {
      const source = await this.evidenceSource.readText(scriptId);
      const url = new URL(scriptId, this.page.url).href;
      injector.registerScript(url, source, {
        strategy: SCRIPT_LOAD_STRATEGY.ASYNC,
        async: true,
      });
    }
    await injector.waitForAllScripts();
    const failures = injector.getErrors();
    if (failures.length > 0) {
      const first = failures[0];
      throw new Error(
        `Evidence script failed: ${first.url}: ${first.error?.message ?? first.error}`,
        { cause: first.error },
      );
    }
    this.runScheduledTasks();
  }

  async resolveEvidenceScriptSource(sourceUrl) {
    const resolvedUrl = new URL(sourceUrl, this.page.url).href;
    const declared = (await this.evidenceSource?.listScripts()) ?? [];
    const match = declared.find(candidate => (
      new URL(candidate.id, this.page.url).href === resolvedUrl
    ));
    if (!match) {
      throw new TypeError(`Evidence script is not declared: ${resolvedUrl}`);
    }
    return this.evidenceSource.readText(match.id);
  }

  disposeEvidenceScripts() {
    this.evidenceScriptObserver?.disconnect?.();
    this.evidenceScriptObserver = null;
    this.evidenceScriptInjector?.dispose();
    this.evidenceScriptInjector = null;
  }

  preWarmShell() {
    // Build a spare realm shell (context + 3984 modules loaded) in the background.
    // Module-level so it survives across RuntimePool instances (request-handler
    // creates a new pool on each RESET_REALM).
    setImmediate(async () => {
      try {
        pendingShell = await createRealmShellAsync();
      } catch {
        pendingShell = null;
      }
    });
  }

  async createRootRealm() {
    const pageUrl = new URL(this.page.url);
    const realmOptions = {
      label: "edge-root-window",
      browserMajorVersion: this.options.fingerprint.browserMajorVersion,
      timingProfile: this.options.fingerprint.timing,
      origin: pageUrl.origin,
      pageUrl: pageUrl.href,
      traceEnabled: this.traceEnabled,
      maxTraceEntries: this.options.proxyTrace.maxEntries,
      screenProfile: this.options.fingerprint.screen,
      navigatorProfile: this.options.fingerprint.navigator,
      localStorageData: this.localStorageByOrigin.get(pageUrl.origin) ?? "",
      sessionStorageData: this.sessionStorageByOrigin.get(pageUrl.origin) ?? "",
      cookieData: this.cookieData,
      pageHtml: this.page.html,
      pageReferrer: this.page.referrer,
      pageContentType: this.page.contentType,
      replay: this.options.replay,
      networkRequestRecorder: this.networkRequestCapture.scopedRecorder({
        kind: "window",
        url: pageUrl.href,
        topLevel: true,
      }),
      childRealmFactory: options => this.createChildRealm(options),
      parentWindow: null,
      topWindow: null,
      parentOrigin: "",
      parentPostMessage: null,
      parentSameOrigin: false,
      outerWindow: null,
      workerFactory: options => this.createDedicatedWorker(options),
      sharedWorkerFactory: options => this.createSharedWorkerConnection(options),
      serviceWorkerFactory: options => this.createServiceWorker(options),
      workletFactory: options => this.createWorkletModule(options),
      broadcastConnector: this.createBroadcastConnector(pageUrl.origin),
      renderingProfile: this.options.fingerprint.rendering,
      capabilitiesProfile: this.options.fingerprint.capabilities,
      nativeFunctionRegistry: this.nativeFunctionRegistry,
      objectURLRegistry: this.objectURLRegistry,
    };
    // Use pre-warmed shell if available (saves ~170ms warm module loading).
    if (pendingShell !== null) {
      const shell = pendingShell;
      pendingShell = null;
      return activateRealmShell(shell, realmOptions);
    }
    return createRealm(realmOptions);
  }

  async createChildRealm(options) {
    const generation = this.captureGeneration();
    const pageUrl = new URL(`${options.pageUrl}`);
    const replayDocument = options.navigationSource === "src"
      ? resolveDocumentReplay(pageUrl.href, this.options.replay)
      : null;
    this.reserveRealmCapacity();
    let realm;
    try {
      realm = await createRealm({
        label: `edge-child-window-${this.childRealms.size + 1}`,
        browserMajorVersion: this.options.fingerprint.browserMajorVersion,
        timingProfile: this.options.fingerprint.timing,
        origin: pageUrl.origin,
        pageUrl: pageUrl.href,
        traceEnabled: this.traceEnabled,
        maxTraceEntries: this.options.proxyTrace.maxEntries,
        screenProfile: this.options.fingerprint.screen,
        navigatorProfile: this.options.fingerprint.navigator,
        localStorageData: this.localStorageByOrigin.get(pageUrl.origin) ?? "",
        sessionStorageData: "",
        cookieData: "",
        pageHtml: replayDocument?.body ?? `${options.pageHtml ?? ""}`,
        pageReferrer: `${options.pageReferrer ?? this.page.url}`,
        pageContentType: replayDocument?.contentType
          ?? `${options.pageContentType ?? "text/html"}`,
        replay: this.options.replay,
        networkRequestRecorder: this.networkRequestCapture.scopedRecorder({
          kind: "window",
          url: pageUrl.href,
          topLevel: false,
        }),
        childRealmFactory: childOptions => this.createChildRealm(childOptions),
        parentWindow: options.parentWindow ?? null,
        topWindow: options.topWindow ?? options.parentWindow ?? null,
        parentOrigin: options.parentOrigin ?? "",
        parentPostMessage: options.parentPostMessage ?? null,
        parentSameOrigin: Boolean(options.sameOrigin),
        outerWindow: options.outerWindow ?? null,
        workerFactory: workerOptions =>
          this.createDedicatedWorker(workerOptions),
        sharedWorkerFactory: workerOptions =>
          this.createSharedWorkerConnection(workerOptions),
        serviceWorkerFactory: workerOptions =>
          this.createServiceWorker(workerOptions),
        workletFactory: workerOptions => this.createWorkletModule(workerOptions),
        broadcastConnector: this.createBroadcastConnector(pageUrl.origin),
        renderingProfile: this.options.fingerprint.rendering,
        capabilitiesProfile: this.options.fingerprint.capabilities,
        nativeFunctionRegistry: this.nativeFunctionRegistry,
        objectURLRegistry: this.objectURLRegistry,
        frameElement: options.frameElement ?? null,
        onContext: context => {
          options.onContext?.(vm.runInContext("globalThis", context));
        },
      });
    } finally {
      this.pendingRealmCreations -= 1;
    }
    if (!this.isGenerationActive(generation)) {
      this.discardRealm(realm);
      throw this.lifecycleError();
    }
    this.childRealms.add(realm);
    return this.createChildWindowHandle(realm, pageUrl);
  }

  createChildWindowHandle(realm, pageUrl) {
    const pool = this;
    const window = vm.runInContext("globalThis", realm.context);
    return {
      window,
      origin: pageUrl.origin,
      deliverParentMessage(message, origin, targetOriginOrOptions, transfer) {
        if (realm.destroyed) return;
        realm.bootstrap.receiveParentMessage(
          message,
          origin,
          targetOriginOrOptions,
          transfer,
        );
      },
      close() {
        pool.destroyChildRealm(realm);
      },
    };
  }

  async createDedicatedWorker(options) {
    const generation = this.captureGeneration();
    const source = resolveWorkerSource(
      options.url,
      this.options.replay,
      this.objectURLRegistry,
      options.creatorOrigin,
    );
    this.reserveRealmCapacity();
    let realm = null;
    try {
      realm = await createWorkerRealm({
        label: `edge-dedicated-worker-${this.childRealms.size + 1}`,
        browserMajorVersion: this.options.fingerprint.browserMajorVersion,
        timingProfile: this.options.fingerprint.timing,
        workerUrl: options.url,
        workerName: options.name,
        workerType: options.type,
        workerKind: "dedicated",
        traceEnabled: this.traceEnabled,
        maxTraceEntries: this.options.proxyTrace.maxEntries,
        navigatorProfile: this.options.fingerprint.navigator,
        replay: this.options.replay,
        networkRequestRecorder: this.networkRequestCapture.scopedRecorder({
          kind: "dedicated-worker",
          url: options.url,
          topLevel: false,
        }),
        postMessage: (message, ports) => {
          options.onMessage(message, ports);
        },
        close: () => {
          if (realm !== null) this.destroyChildRealm(realm);
        },
        nestedWorkerFactory: workerOptions =>
          this.createDedicatedWorker(workerOptions),
        nestedSharedWorkerFactory: workerOptions =>
          this.createSharedWorkerConnection(workerOptions),
        broadcastConnector: this.createBroadcastConnector(
          new URL(options.url).origin,
        ),
        renderingProfile: this.options.fingerprint.rendering,
        capabilitiesProfile: this.options.fingerprint.capabilities,
        objectURLRegistry: this.objectURLRegistry,
      });
    } finally {
      this.pendingRealmCreations -= 1;
    }
    if (!this.isGenerationActive(generation)) {
      this.discardRealm(realm);
      throw this.lifecycleError();
    }
    this.childRealms.add(realm);
    try {
      await evaluateWorkerSource(
        realm,
        source,
        options.type,
        options.url,
        this.moduleImporterFor(realm, options.url),
      );
      this.assertGenerationActive(generation);
    } catch (error) {
      this.destroyChildRealm(realm);
      throw error;
    }
    const pool = this;
    return {
      deliverOwnerMessage(message, transferOptions, ports) {
        if (realm.destroyed) return;
        realm.bootstrap.receiveOwnerMessageEvent(
          message,
          transferOptions,
          ports,
        );
      },
      terminate() {
        pool.destroyChildRealm(realm);
      },
    };
  }

  async createSharedWorkerConnection(options) {
    const generation = this.captureGeneration();
    const key = `${options.creatorOrigin}\0${options.url}\0${options.name}`;
    let creating = this.sharedWorkers.get(key);
    if (creating === undefined) {
      creating = this.createSharedWorkerRealm(key, options);
      this.sharedWorkers.set(key, creating);
    }
    let shared;
    try {
      shared = await creating;
    } catch (error) {
      if (this.sharedWorkers.get(key) === creating) {
        this.sharedWorkers.delete(key);
      }
      throw error;
    }
    if (this.sharedWorkers.get(key) === creating) {
      this.sharedWorkers.set(key, shared);
    }
    this.assertGenerationActive(generation);
    const connection = shared.realm.bootstrap.connectSharedWorkerConnection(
      (message, ports) => options.onMessage(message, ports),
    );
    shared.connections.add(connection);
    const pool = this;
    return {
      deliverOwnerMessage(message, ports) {
        if (!shared.realm.destroyed) {
          connection.deliverOwnerMessage(message, ports);
        }
      },
      close() {
        connection.close();
        shared.connections.delete(connection);
        if (shared.connections.size === 0) {
          pool.destroyChildRealm(shared.realm);
          if (pool.sharedWorkers.get(key) === shared) {
            pool.sharedWorkers.delete(key);
          }
        }
      },
    };
  }

  async createSharedWorkerRealm(key, options, generation = this.captureGeneration()) {
    const source = resolveWorkerSource(
      options.url,
      this.options.replay,
      this.objectURLRegistry,
      options.creatorOrigin,
    );
    this.reserveRealmCapacity();
    let realm = null;
    try {
      realm = await createWorkerRealm({
        label: `edge-shared-worker-${this.childRealms.size + 1}`,
        browserMajorVersion: this.options.fingerprint.browserMajorVersion,
        timingProfile: this.options.fingerprint.timing,
        workerUrl: options.url,
        workerName: options.name,
        workerType: options.type,
        workerKind: "shared",
        traceEnabled: this.traceEnabled,
        maxTraceEntries: this.options.proxyTrace.maxEntries,
        navigatorProfile: this.options.fingerprint.navigator,
        replay: this.options.replay,
        networkRequestRecorder: this.networkRequestCapture.scopedRecorder({
          kind: "shared-worker",
          url: options.url,
          topLevel: false,
        }),
        postMessage: null,
        close: () => {
          if (realm !== null) {
            this.destroyChildRealm(realm);
            this.sharedWorkers.delete(key);
          }
        },
        nestedWorkerFactory: workerOptions =>
          this.createDedicatedWorker(workerOptions),
        nestedSharedWorkerFactory: workerOptions =>
          this.createSharedWorkerConnection(workerOptions),
        broadcastConnector: this.createBroadcastConnector(
          new URL(options.url).origin,
        ),
        renderingProfile: this.options.fingerprint.rendering,
        capabilitiesProfile: this.options.fingerprint.capabilities,
        objectURLRegistry: this.objectURLRegistry,
      });
    } finally {
      this.pendingRealmCreations -= 1;
    }
    if (!this.isGenerationActive(generation)) {
      this.discardRealm(realm);
      throw this.lifecycleError();
    }
    this.childRealms.add(realm);
    try {
      await evaluateWorkerSource(
        realm,
        source,
        options.type,
        options.url,
        this.moduleImporterFor(realm, options.url),
      );
      this.assertGenerationActive(generation);
    } catch (error) {
      this.destroyChildRealm(realm);
      throw error;
    }
    return {
      realm,
      connections: new Set(),
    };
  }

  async createServiceWorker(options) {
    const generation = this.captureGeneration();
    const source = resolveWorkerSource(
      options.url,
      this.options.replay,
      this.objectURLRegistry,
      options.creatorOrigin,
    );
    this.reserveRealmCapacity();
    let realm = null;
    try {
      realm = await createWorkerRealm({
        label: `edge-service-worker-${this.childRealms.size + 1}`,
        browserMajorVersion: this.options.fingerprint.browserMajorVersion,
        timingProfile: this.options.fingerprint.timing,
        workerUrl: options.url,
        workerName: "",
        workerType: options.type,
        workerKind: "service",
        traceEnabled: this.traceEnabled,
        maxTraceEntries: this.options.proxyTrace.maxEntries,
        navigatorProfile: this.options.fingerprint.navigator,
        replay: this.options.replay,
        networkRequestRecorder: this.networkRequestCapture.scopedRecorder({
          kind: "service-worker",
          url: options.url,
          topLevel: false,
        }),
        postMessage: (message, ports) => {
          options.onMessage(message, ports);
        },
        close: () => {
          if (realm !== null) this.destroyChildRealm(realm);
        },
        nestedWorkerFactory: workerOptions =>
          this.createDedicatedWorker(workerOptions),
        nestedSharedWorkerFactory: workerOptions =>
          this.createSharedWorkerConnection(workerOptions),
        broadcastConnector: this.createBroadcastConnector(
          new URL(options.url).origin,
        ),
        renderingProfile: this.options.fingerprint.rendering,
        capabilitiesProfile: this.options.fingerprint.capabilities,
        objectURLRegistry: this.objectURLRegistry,
      });
    } finally {
      this.pendingRealmCreations -= 1;
    }
    if (!this.isGenerationActive(generation)) {
      this.discardRealm(realm);
      throw this.lifecycleError();
    }
    this.childRealms.add(realm);
    try {
      options.onState("installing");
      await evaluateWorkerSource(
        realm,
        source,
        options.type,
        options.url,
        this.moduleImporterFor(realm, options.url),
      );
      await realm.bootstrap.runServiceWorkerLifecycle("install");
      options.onState("installed");
      options.onState("activating");
      await realm.bootstrap.runServiceWorkerLifecycle("activate");
      this.assertGenerationActive(generation);
      options.onState("activated");
    } catch (error) {
      this.destroyChildRealm(realm);
      throw error;
    }
    const pool = this;
    return {
      deliverOwnerMessage(message, ports) {
        if (!realm.destroyed) {
          realm.bootstrap.receiveOwnerMessageEvent(message, undefined, ports);
        }
      },
      terminate() {
        pool.destroyChildRealm(realm);
      },
    };
  }

  async createWorkletModule(options) {
    const generation = this.captureGeneration();
    let worklets = this.workletRealmsByOwner.get(options.owner);
    if (worklets === undefined) {
      worklets = new Map();
      this.workletRealmsByOwner.set(options.owner, worklets);
    }
    const key = `${options.kind}\0${options.id}`;
    let creating = worklets.get(key);
    if (creating === undefined) {
      creating = this.createWorkletState(options);
      worklets.set(key, creating);
    }
    let state;
    try {
      state = await creating;
    } catch (error) {
      if (worklets.get(key) === creating) worklets.delete(key);
      throw error;
    }
    this.assertGenerationActive(generation);
    const source = resolveWorkerSource(
      options.url,
      this.options.replay,
      this.objectURLRegistry,
      options.creatorOrigin,
    );
    await evaluateWorkletModule(state.realm, source, options.url);
    this.assertGenerationActive(generation);
  }

  async createWorkletState(options) {
    const generation = this.captureGeneration();
    this.reserveRealmCapacity();
    let realm;
    try {
      realm = await createWorkletRealm({
        label: `edge-${options.kind}-worklet-${this.childRealms.size + 1}`,
        kind: options.kind,
        origin: options.creatorOrigin,
        traceEnabled: this.traceEnabled,
        maxTraceEntries: this.options.proxyTrace.maxEntries,
        objectURLRegistry: this.objectURLRegistry,
      });
    } finally {
      this.pendingRealmCreations -= 1;
    }
    if (!this.isGenerationActive(generation)) {
      this.discardRealm(realm);
      throw this.lifecycleError();
    }
    this.childRealms.add(realm);
    return { realm };
  }

  async evaluate(source) {
    const script = getCachedScript(source);
    return this.evaluateCompiled(script);
  }

  async batchEvaluate(sources) {
    const realm = assertLiveRealm(this.realm);
    const results = [];
    for (const source of sources) {
      const script = getCachedScript(source);
      this.runScheduledTasks();
      const rawValue = script.runInContext(realm.context);
      if (isPromise(rawValue)) {
        results.push(await settleRealmPromise(rawValue, realm, this));
      } else {
        results.push(normalizeEvaluationResult(
          rawValue,
          this.options.limits.maxOutputBytes,
        ));
      }
    }
    this.runScheduledTasks();
    return results;
  }

  async evaluateCompiled(script) {
    if (!(script instanceof vm.Script)) {
      throw new TypeError("Compiled sandbox input must be a vm.Script");
    }
    const realm = assertLiveRealm(this.realm);
    this.runScheduledTasks();
    const rawValue = script.runInContext(realm.context);
    if (isPromise(rawValue)) {
      return settleRealmPromise(rawValue, realm, this);
    }
    this.runScheduledTasks();
    return normalizeEvaluationResult(
      rawValue,
      this.options.limits.maxOutputBytes,
    );
  }

  executeCompiled(script) {
    if (!(script instanceof vm.Script)) {
      throw new TypeError("Compiled sandbox input must be a vm.Script");
    }
    const realm = assertLiveRealm(this.realm);
    this.runScheduledTasks();
    script.runInContext(realm.context);
    this.runScheduledTasks();
  }

  /**
   * 为指定 Realm 建立动态 import 处理器（ADR-0003）。
   *
   * 目标脚本的模块从 replay / Evidence Bundle 解析，未命中给结构化拒绝，
   * 任何情况下不触达真实网络。
   *
   * 缓存挂在 Realm 上：模块实例持有状态，跨 Realm 共享会破坏隔离。
   */
  moduleImporterFor(realm, referrerUrl) {
    if (realm.__nv8ModuleCache === undefined) {
      realm.__nv8ModuleCache = new Map();
    }
    const entries = this.evidenceReplayEntries ?? this.options.replay ?? [];
    return createDynamicImporter({
      context: realm.context,
      cache: realm.__nv8ModuleCache,
      defaultReferrer: referrerUrl,
      resolveSource: url => {
        const record = entries.find(entry => (
          `${entry.method ?? "GET"}`.toUpperCase() === "GET" && entry.url === url
        ));
        return record === undefined ? null : `${record.body ?? ""}`;
      },
      availableUrls: () => entries
        .filter(entry => `${entry.method ?? "GET"}`.toUpperCase() === "GET")
        .map(entry => `${entry.url}`),
    });
  }

  async evaluateModule(source, url) {
    const realm = assertLiveRealm(this.realm);
    const moduleUrl = normalizeModuleUrl(url, this.page.url);
    const importDynamic = this.moduleImporterFor(realm, moduleUrl);
    // 静态 import 与动态走同一条重放路径：同一份 Bundle 里的模块不应因
    // 引入方式不同而待遇不同。loadEntryModule 内部处理 link，避免调用方
    // 自己写 link 而踩「边递归边 link」在循环依赖上失败的坑。
    const module = await importDynamic.loadEntryModule(source, moduleUrl);

    const evaluation = module.evaluate();
    if (isPromise(evaluation)) {
      await settleRealmPromise(evaluation, realm, this);
    } else {
      await evaluation;
    }
    return evaluationResult("undefined", undefined);
  }

  exportPersistence() {
    const localStorageByOrigin = new Map(this.localStorageByOrigin);
    const sessionStorageByOrigin = new Map(this.sessionStorageByOrigin);
    let cookieData = this.cookieData;
    if (this.realm !== null && !this.realm.destroyed) {
      localStorageByOrigin.set(
        this.realm.origin,
        this.realm.bootstrap.exportLocalStorage(),
      );
      sessionStorageByOrigin.set(
        this.realm.origin,
        this.realm.bootstrap.exportSessionStorage(),
      );
      cookieData = this.realm.bootstrap.exportCookies();
    }
    return {
      localStorageByOrigin: [...localStorageByOrigin],
      sessionStorageByOrigin: [...sessionStorageByOrigin],
      cookieData,
      networkCapture: this.networkRequestCapture.exportState(),
    };
  }

  async resetRealm(page, replay) {
    this.generation += 1;
    const generation = this.generation;
    // Export current state before destroying.
    const persistence = this.exportPersistence();
    this.disposeEvidenceScripts();
    // Destroy all child realms and the root realm.
    this.destroyChildRealms();
    if (this.realm !== null) {
      this.realm.bootstrap.clearScheduledTasks();
      destroyRealm(this.realm);
      this.realm = null;
    }
    this.objectURLRegistry.clear();
    // Apply persisted state for the new realm.
    this.localStorageByOrigin = new Map(persistence.localStorageByOrigin);
    this.sessionStorageByOrigin = new Map(persistence.sessionStorageByOrigin);
    this.cookieData = persistence.cookieData;
    this.networkRequestCapture.restoreFromExport(persistence.networkCapture);
    // Update options for the new page.
    this.page = page;
    this.options = Object.freeze({
      ...this.options,
      page,
      replay: replay ?? this.options.replay,
    });
    if (this.evidenceSource !== null && this.options.evidence?.usePage) {
      await this.applyEvidencePage();
      this.options = Object.freeze({
        ...this.options,
        page: this.page,
        replay: this.evidenceReplayEntries ?? this.options.replay,
      });
    }
    // Recreate root realm (SOURCE_CACHE remains warm).
    this.realm = await this.createRootRealm();
    if (!this.isGenerationActive(generation)) {
      this.realm.bootstrap.clearScheduledTasks();
      destroyRealm(this.realm);
      this.realm = null;
      throw this.lifecycleError();
    }
    await this.injectEvidenceScripts();
    this.preWarmShell();
    return persistence;
  }

  enableTrace() {
    this.traceEnabled = true;
    assertLiveRealm(this.realm).bootstrap.enableProxyTrace();
  }

  disableTrace() {
    this.traceEnabled = false;
    assertLiveRealm(this.realm).bootstrap.disableProxyTrace();
  }

  clearTrace() {
    assertLiveRealm(this.realm).bootstrap.clearProxyTrace();
  }

  readTrace() {
    const records = assertLiveRealm(this.realm).bootstrap.proxyTrace();
    const output = new Array(records.length);
    for (let index = 0; index < records.length; index += 1) {
      const record = records[index];
      output[index] = {
        sequence: record.sequence,
        operation: record.operation,
        api: record.api,
        receiver: record.receiver,
        arguments: Array.from(record.arguments),
        result: record.result,
      };
    }
    return output;
  }

  readNetworkRequests() {
    return this.networkRequestCapture.read();
  }

  readResources() {
    const root = this.realm?.bootstrap?.resourceSnapshot?.() ?? {};
    return {
      generation: this.generation,
      pendingRealmCreations: this.pendingRealmCreations,
      childRealms: Number(this.childRealms.size),
      sharedWorkerGraphs: Number(this.sharedWorkers.size),
      root: {
        workers: Number(root.workers ?? 0),
        sharedWorkers: Number(root.sharedWorkers ?? 0),
        serviceWorkers: Number(root.serviceWorkers ?? 0),
      },
    };
  }

  clearNetworkRequests() {
    this.networkRequestCapture.clear();
  }

  close() {
    if (this.closed) return;
    this.closed = true;
    this.generation += 1;
    this.disposeEvidenceScripts();
    this.destroyChildRealms();
    if (this.realm !== null) {
      this.realm.bootstrap.clearScheduledTasks();
      destroyRealm(this.realm);
      this.realm = null;
    }
    this.objectURLRegistry.clear();
  }

  destroyChildRealms() {
    for (const shared of this.sharedWorkers.values()) {
      for (const connection of [...shared.connections]) {
        connection.close?.();
      }
      shared.connections.clear();
    }
    for (const realm of [...this.childRealms]) this.destroyChildRealm(realm);
    this.childRealms.clear();
    this.sharedWorkers.clear();
    this.workletRealmsByOwner = new WeakMap();
  }

  discardRealm(realm) {
    if (realm === null || realm === undefined || realm.destroyed) return;
    realm.bootstrap?.markWindowClosed?.();
    realm.bootstrap?.clearScheduledTasks?.();
    destroyRealm(realm);
  }

  captureGeneration() {
    if (this.closed) throw this.lifecycleError();
    return this.generation;
  }

  isGenerationActive(generation) {
    return !this.closed && generation === this.generation;
  }

  assertGenerationActive(generation) {
    if (!this.isGenerationActive(generation)) throw this.lifecycleError();
  }

  lifecycleError() {
    const error = new Error('Sandbox Realm lifecycle is no longer active');
    error.code = 'ERR_NV8_REALM_LIFECYCLE';
    return error;
  }

  destroyChildRealm(realm) {
    if (!this.childRealms.has(realm)) return;
    if (!realm.destroyed) {
      realm.bootstrap.markWindowClosed?.();
      realm.bootstrap.clearScheduledTasks();
      destroyRealm(realm);
    }
    this.childRealms.delete(realm);
  }

  runScheduledTasks() {
    assertLiveRealm(this.realm).bootstrap.runScheduledTasks();
    for (const realm of this.childRealms) {
      if (!realm.destroyed) realm.bootstrap.runScheduledTasks();
    }
  }

  nextScheduledTaskDelay() {
    let delay = assertLiveRealm(this.realm).bootstrap.nextScheduledTaskDelay();
    for (const realm of this.childRealms) {
      if (realm.destroyed) continue;
      const candidate = realm.bootstrap.nextScheduledTaskDelay();
      if (candidate !== null && (delay === null || candidate < delay)) {
        delay = candidate;
      }
    }
    return delay;
  }

  reserveRealmCapacity() {
    if (this.closed) throw this.lifecycleError();
    const effectiveRealmLimit = Math.min(
      this.options.limits.maxRealms,
      this.heapSafeRealmLimit,
    );
    if (
      this.childRealms.size + this.pendingRealmCreations
      >= effectiveRealmLimit - 1
    ) {
      const heapLimited = effectiveRealmLimit < this.options.limits.maxRealms;
      const error = new DOMException(
        heapLimited
          ? "The sandbox heap-safe realm limit has been reached."
          : "The sandbox realm limit has been reached.",
        "QuotaExceededError",
      );
      Object.defineProperties(error, {
        nv8Code: {
          value: heapLimited ? "LIMIT_HEAP_BYTES" : "LIMIT_REALM_CAPACITY",
          enumerable: true,
        },
        limit: {
          value: effectiveRealmLimit,
          enumerable: true,
        },
      });
      throw error;
    }
    this.pendingRealmCreations += 1;
  }

  createBroadcastConnector(origin) {
    return (name, receive) => {
      const key = `${origin}\0${name}`;
      let group = this.broadcastGroups.get(key);
      if (group === undefined) {
        group = new Set();
        this.broadcastGroups.set(key, group);
      }
      const endpoint = { receive };
      group.add(endpoint);
      return {
        publish(message) {
          for (const candidate of group) {
            if (candidate !== endpoint) candidate.receive(message);
          }
        },
        close: () => {
          group.delete(endpoint);
          if (group.size === 0) this.broadcastGroups.delete(key);
        },
      };
    };
  }
}

async function settleRealmPromise(promise, realm, pool) {
  const observerId = realm.bootstrap.observeEvaluationPromise(promise);
  for (;;) {
    // Fast path: flush microtasks and check immediately.
    await Promise.resolve();
    pool.runScheduledTasks();
    const observation = realm.bootstrap.readEvaluationPromise(observerId);
    if (observation.status === 1) {
      return normalizeObservedEvaluationResult(
        observation.type,
        observation.value,
        pool.options.limits.maxOutputBytes,
      );
    }
    if (observation.status === 2) {
      const error = new Error(observation.message);
      error.name = observation.name || "Error";
      if (observation.stack) {
        error.stack = observation.stack;
      }
      throw error;
    }
    if (observation.status !== 0) {
      throw new Error("Realm promise observer entered an invalid state");
    }
    // Slow path: sleep until the next scheduled timer fires.
    const scheduledDelay = pool.nextScheduledTaskDelay();
    await hostDelay(
      scheduledDelay === null ? 1 : Math.max(1, scheduledDelay),
      undefined,
      { ref: true },
    );
    pool.runScheduledTasks();
  }
}

function normalizeObservedEvaluationResult(type, value, maxOutputBytes) {
  if (type === 'string') {
    assertOutputBytes(value, maxOutputBytes);
  }
  return evaluationResult(type, value);
}

function normalizeEvaluationResult(value, maxOutputBytes) {
  if (value === undefined) {
    return evaluationResult("undefined", undefined);
  }
  if (value === null) {
    return evaluationResult("null", null);
  }
  const type = typeof value;
  if (type === "boolean") {
    return evaluationResult(type, value);
  }
  if (type === "string") {
    assertOutputBytes(value, maxOutputBytes);
    return evaluationResult(type, value);
  }
  if (type === "number") {
    return evaluationResult("number", value);
  }
  return evaluationResult("other", undefined);
}

function assertOutputBytes(value, maxOutputBytes) {
  if (Buffer.byteLength(`${value}`, 'utf8') <= maxOutputBytes) return;
  const error = new RangeError('Evaluation output exceeds limits.maxOutputBytes');
  error.code = 'LIMIT_OUTPUT_BYTES';
  error.limit = maxOutputBytes;
  throw error;
}

function normalizeModuleUrl(url, pageUrl) {
  let parsed;
  try {
    parsed = new URL(url, pageUrl);
  } catch {
    throw new TypeError("Invalid module URL");
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new TypeError("Module URL must use http or https");
  }
  return parsed.href;
}

function resolveWorkerSource(
  url,
  replay,
  objectURLRegistry,
  creatorOrigin = undefined,
) {
  const parsed = new URL(`${url}`);
  if (parsed.protocol === "data:") return decodeDataScript(parsed.href);
  if (parsed.protocol === "blob:") {
    const record = objectURLRegistry.resolve(parsed.href);
    if (record === undefined) {
      throw new DOMException(
        "The worker object URL has been revoked or is not registered.",
        "NetworkError",
      );
    }
    if (
      creatorOrigin !== undefined
      && creatorOrigin !== "null"
      && record.origin !== creatorOrigin
    ) {
      throw new DOMException(
        "The worker object URL must use the creator's origin.",
        "SecurityError",
      );
    }
    return new TextDecoder().decode(record.bytes);
  }
  const match = replay.find(entry =>
    entry.method === "GET" && entry.url === parsed.href);
  if (match === undefined) {
    throw new TypeError(`No offline replay entry for worker script: ${parsed.href}`);
  }
  return `${match.body}`;
}

async function createRuntimeReplayEntries(fixture, source) {
  if (!fixture || !Array.isArray(fixture.requests)) {
    throw new TypeError("Evidence replay fixture must contain a requests array");
  }
  const entries = [];
  for (const [index, record] of fixture.requests.entries()) {
    const request = record?.request;
    const response = record?.response;
    if (!request || !response || typeof request.url !== "string") {
      throw new TypeError(`Invalid Evidence replay request at index ${index}`);
    }
    let body = response.body ?? "";
    if (response.bodyFile !== undefined) {
      body = await source.readText(response.bodyFile);
    } else if (response.bodyBase64 !== undefined) {
      body = Buffer.from(`${response.bodyBase64}`, "base64").toString("utf8");
    } else if (typeof body !== "string") {
      body = JSON.stringify(body);
    }
    entries.push({
      method: `${request.method ?? "GET"}`.toUpperCase(),
      url: `${request.url}`,
      status: Number(response.status ?? 200),
      statusText: `${response.statusText ?? ""}`,
      headers: normalizeReplayHeaders(response.headers),
      body: `${body}`,
      redirected: Boolean(response.redirected),
      type: `${response.type ?? "basic"}`,
    });
  }
  return entries;
}

function normalizeReplayHeaders(headers) {
  if (Array.isArray(headers)) {
    return Object.fromEntries(headers.map(header => [
      `${header.name ?? header[0]}`,
      `${header.value ?? header[1]}`,
    ]));
  }
  if (headers === null || typeof headers !== "object") return {};
  return Object.fromEntries(
    Object.entries(headers).map(([name, value]) => [name, `${value}`]),
  );
}

function resolveDocumentReplay(url, replay) {
  const match = replay.find(entry => entry.method === "GET" && entry.url === url);
  if (match === undefined || match.status < 200 || match.status >= 300) return null;
  let contentType = "text/html";
  for (const [name, value] of Object.entries(match.headers)) {
    if (name.toLowerCase() === "content-type") {
      contentType = `${value}`.split(";", 1)[0].trim() || contentType;
      break;
    }
  }
  return {
    body: `${match.body}`,
    contentType,
  };
}

function decodeDataScript(url) {
  const comma = url.indexOf(",");
  if (comma < 0) throw new TypeError("Invalid data worker URL");
  const metadata = url.slice(5, comma);
  const payload = url.slice(comma + 1);
  if (!metadata.toLowerCase().endsWith(";base64")) {
    try {
      return decodeURIComponent(payload);
    } catch {
      throw new TypeError("Invalid percent encoding in data worker URL");
    }
  }
  let binary;
  try {
    binary = atob(payload);
  } catch {
    throw new TypeError("Invalid base64 encoding in data worker URL");
  }
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return new TextDecoder().decode(bytes);
}

async function evaluateWorkerSource(realm, source, type, url, importer = null) {
  if (type === "module") {
    // Worker 的模块图与页面共用同一条重放路径（ADR-0003）
    if (importer !== null) {
      const module = await importer.loadEntryModule(source, url);
      await module.evaluate();
      return;
    }
    const module = new vm.SourceTextModule(source, {
      context: realm.context,
      identifier: url,
      initializeImportMeta(meta) {
        meta.url = url;
      },
      importModuleDynamically(specifier) {
        rejectDynamicImport(specifier, "this worker");
      },
    });
    await module.link(specifier => {
      rejectDynamicImport(specifier, "this worker");
    });
    await module.evaluate();
    return;
  }
  const script = new vm.Script(source, {
    filename: url,
    importModuleDynamically(specifier) {
      return importer === null
        ? rejectDynamicImport(specifier, "this worker")
        : importer(specifier, url);
    },
  });
  script.runInContext(realm.context);
}

async function evaluateWorkletModule(realm, source, url) {
  const module = new vm.SourceTextModule(source, {
    context: realm.context,
    identifier: url,
    initializeImportMeta(meta) {
      meta.url = url;
    },
    importModuleDynamically(specifier) {
      // Worklet 规范本身不支持动态 import，这里的拒绝是正确行为
      rejectDynamicImport(specifier, "worklet modules");
    },
  });
  await module.link(specifier => {
    rejectDynamicImport(specifier, "worklet modules");
  });
  await module.evaluate();
}

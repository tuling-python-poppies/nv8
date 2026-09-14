import vm from "node:vm";
import { randomFillSync, randomUUID } from "node:crypto";
import { auditRealmGlobals } from "./global-audit.js";
import { RealmModuleLoader } from "./module-loader.js";

export function createRealmShell(label = "edge-root-window", origin = "") {
  const { context, moduleLoader } = createRealmShellContext(label, origin);
  const bootstrap = moduleLoader.importInternal(
    "edge-internal:bootstrap-root",
  );
  return { context, moduleLoader, bootstrap };
}

/**
 * 异步版 shell 创建。
 *
 * Node 18–22 无同步 vm module 链接，因此 legacy bootstrap 必须走这条路径。
 * Node 24 上两者结果等价。
 *
 * @param {string} [label]
 * @param {string} [origin]
 * @returns {Promise<{context: object, moduleLoader: object, bootstrap: object}>}
 */
export async function createRealmShellAsync(label = "edge-root-window", origin = "") {
  const { context, moduleLoader } = createRealmShellContext(label, origin);
  const bootstrap = await moduleLoader.importInternalAsync(
    "edge-internal:bootstrap-root",
  );
  return { context, moduleLoader, bootstrap };
}

function createRealmShellContext(label, origin) {
  const sandboxGlobal = Object.create(null);
  const context = vm.createContext(sandboxGlobal, {
    name: label,
    origin,
    codeGeneration: {
      strings: true,
      wasm: true,
    },
  });
  // 宿主泄漏审计必须在**任何页面脚本执行之前**跑（IKFD9K）。
  // 以前它挂在 activateRealmShell 末尾，而 bootstrapRoot() 内部就执行
  // 页面 inline 脚本——页面写一个 `window.process = {}` 就会被误判成
  // 宿主泄漏。审计语义是「realm 里有没有宿主全局」，不是「页面定义了什么」，
  // 因此紧跟 context 创建执行最准确。
  auditRealmGlobals(context);
  installPendingWindowIdentity(context);
  return { context, moduleLoader: new RealmModuleLoader(context) };
}

export function activateRealmShell(shell, options) {
  const {
    label = "edge-root-window",
    origin = "",
    pageUrl,
    traceEnabled = false,
    maxTraceEntries = 100_000,
    screenProfile = null,
    navigatorProfile = null,
    localStorageData = "",
    sessionStorageData = "",
    cookieData = "",
    pageHtml = "",
    pageReferrer = "",
    pageContentType = "text/html",
    replay = [],
    networkRequestRecorder = null,
    childRealmFactory = null,
    parentWindow = null,
    topWindow = null,
    parentOrigin = "",
    parentPostMessage = null,
    parentSameOrigin = false,
    outerWindow = null,
    workerFactory = null,
    sharedWorkerFactory = null,
    serviceWorkerFactory = null,
    workletFactory = null,
    broadcastConnector = null,
    renderingProfile = null,
    capabilitiesProfile = null,
    browserMajorVersion = 150,
    timingProfile = null,
    nativeFunctionRegistry = null,
    objectURLRegistry = null,
    frameElement = null,
    documentBaseUrl = null,
    serviceWorkerPageUrl = null,
    workerDepth = 0,
    timezone = null,
    cryptoEntropy = createCryptoEntropy(),
    onContext = null,
  } = options;
  const { context, moduleLoader, bootstrap } = shell;
  bootstrap.namespace.bootstrapRoot(
    traceEnabled,
    maxTraceEntries,
    screenProfile?.width ?? 1920,
    screenProfile?.height ?? 1080,
    screenProfile?.availWidth ?? 1920,
    screenProfile?.availHeight ?? 1040,
    screenProfile?.colorDepth ?? 24,
    screenProfile?.pixelDepth ?? 24,
    screenProfile?.devicePixelRatio ?? 1,
    screenProfile?.availLeft ?? 0,
    screenProfile?.availTop ?? 0,
    screenProfile?.isExtended ?? false,
    pageUrl,
    navigatorProfile?.userAgent
      ?? "Mozilla/5.0 Chrome/150.0.0.0 Safari/537.36",
    navigatorProfile?.platform ?? "Win32",
    encodeStringList(navigatorProfile?.languages ?? ["en-US", "en"]),
    navigatorProfile?.language ?? "en-US",
    navigatorProfile?.hardwareConcurrency ?? 8,
    navigatorProfile?.deviceMemory ?? 8,
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
    navigatorProfile,
    frameElement,
    origin,
    documentBaseUrl,
    serviceWorkerPageUrl,
    workerDepth,
    timezone,
    cryptoEntropy,
  );
  if (typeof onContext === "function") onContext(context);
  return {
    context,
    moduleLoader,
    bootstrap: bootstrap.namespace,
    label,
    origin,
    pageUrl,
    destroyed: false,
  };
}

function createCryptoEntropy() {
  return Object.freeze({
    randomFill(bytes) {
      randomFillSync(bytes);
      return bytes;
    },
    randomUUID,
  });
}

export async function createRealm(options) {
  const pageUrl = new URL(options.pageUrl || options.page?.url || "about:blank");
  // 走异步 shell：Node 18–22 无同步 vm module 链接
  const shell = await createRealmShellAsync(
    options.label,
    options.origin ?? pageUrl.origin,
  );
  return activateRealmShell(shell, options);
}

function installPendingWindowIdentity(context) {
  vm.runInContext(`
    Object.defineProperties(globalThis, {
      window: {
        value: globalThis,
        writable: true,
        enumerable: true,
        configurable: true,
      },
      self: {
        value: globalThis,
        writable: true,
        enumerable: true,
        configurable: true,
      },
      top: {
        value: globalThis,
        writable: true,
        enumerable: true,
        configurable: true,
      },
      parent: {
        value: globalThis,
        writable: true,
        enumerable: true,
        configurable: true,
      },
      frames: {
        value: globalThis,
        writable: true,
        enumerable: true,
        configurable: true,
      },
      length: {
        value: 0,
        writable: true,
        enumerable: true,
        configurable: true,
      },
      closed: {
        value: false,
        writable: true,
        enumerable: true,
        configurable: true,
      },
    });
  `, context);
}

function encodeStringList(values) {
  let output = "";
  for (const value of values) {
    output += `${value.length}:${value}`;
  }
  return output;
}

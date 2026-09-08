import {
  performStructuredCloneDetailed,
} from "../clone/structured-clone-algorithm.js";
import { Event } from "../event/event-constructor.js";
import { EventTarget } from "../event/event-target-constructor.js";
import { initializeEventTarget } from "../event/event-target-state.js";
import { MessageEvent } from "../messaging/messaging-runtime.js";
import {
  Request,
  Response,
  requireResponse,
  responseBytes,
} from "../fetch/request-response-runtime.js";
import { headersEntries } from "../fetch/headers-runtime.js";
import {
  configureGPUProfile,
  createGPU,
} from "../gpu/gpu-runtime.js";
import { createStorageManager } from "../file-system/file-system-runtime.js";
import { createNavigatorUAData } from "../navigator/navigator-ua-data-state.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../../engine/webidl/descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../../engine/webidl/native-function.js";

let outbound = null;
let closeWorker = null;
let workerClosed = false;
let workerUrl = "https://sandbox.test/";
let workerName = "";
let workerType = "classic";
let replayRecords = [];
let globalKind = "dedicated";
let workerLocationValue;
let workerNavigatorValue;
let workerOrigin = "https://sandbox.test";
let workerSecureContext = true;
let serviceWorkerControl = null;
const handlers = new Map();

export function WorkerGlobalScope() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(WorkerGlobalScope, "WorkerGlobalScope");

export function DedicatedWorkerGlobalScope() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(DedicatedWorkerGlobalScope, "DedicatedWorkerGlobalScope");

export function SharedWorkerGlobalScope() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SharedWorkerGlobalScope, "SharedWorkerGlobalScope");

export function ServiceWorkerGlobalScope() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(ServiceWorkerGlobalScope, "ServiceWorkerGlobalScope");

export function WorkerNavigator() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(WorkerNavigator, "WorkerNavigator");

export function WorkerLocation() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(WorkerLocation, "WorkerLocation");

export function installDedicatedWorkerGlobal({
  kind,
  name,
  url,
  type,
  replay,
  navigatorProfile,
  renderingProfile = null,
  postMessage,
  close,
  serviceWorkerControl: control = null,
}) {
  Object.setPrototypeOf(WorkerGlobalScope.prototype, EventTarget.prototype);
  Object.setPrototypeOf(WorkerGlobalScope, EventTarget);
  Object.setPrototypeOf(
    DedicatedWorkerGlobalScope.prototype,
    WorkerGlobalScope.prototype,
  );
  Object.setPrototypeOf(DedicatedWorkerGlobalScope, WorkerGlobalScope);
  Object.setPrototypeOf(
    SharedWorkerGlobalScope.prototype,
    WorkerGlobalScope.prototype,
  );
  Object.setPrototypeOf(SharedWorkerGlobalScope, WorkerGlobalScope);
  Object.setPrototypeOf(
    ServiceWorkerGlobalScope.prototype,
    WorkerGlobalScope.prototype,
  );
  Object.setPrototypeOf(ServiceWorkerGlobalScope, WorkerGlobalScope);
  delete WorkerGlobalScope.prototype.constructor;
  delete DedicatedWorkerGlobalScope.prototype.constructor;
  delete SharedWorkerGlobalScope.prototype.constructor;
  delete ServiceWorkerGlobalScope.prototype.constructor;
  defineGlobalConstructor("WorkerGlobalScope", WorkerGlobalScope);
  defineGlobalConstructor(
    "DedicatedWorkerGlobalScope",
    DedicatedWorkerGlobalScope,
  );
  defineGlobalConstructor("SharedWorkerGlobalScope", SharedWorkerGlobalScope);
  defineGlobalConstructor(
    "ServiceWorkerGlobalScope",
    ServiceWorkerGlobalScope,
  );
  for (const Constructor of [WorkerNavigator, WorkerLocation]) {
    delete Constructor.prototype.constructor;
    defineGlobalConstructor(Constructor.name, Constructor);
    defineConstructorBacklink(Constructor.prototype, Constructor);
    defineToStringTag(Constructor.prototype, Constructor.name);
  }
  defineConstructorBacklink(WorkerGlobalScope.prototype, WorkerGlobalScope);
  defineConstructorBacklink(
    ServiceWorkerGlobalScope.prototype,
    ServiceWorkerGlobalScope,
  );
  defineConstructorBacklink(
    SharedWorkerGlobalScope.prototype,
    SharedWorkerGlobalScope,
  );
  defineToStringTag(WorkerGlobalScope.prototype, "WorkerGlobalScope");
  defineToStringTag(
    DedicatedWorkerGlobalScope.prototype,
    "DedicatedWorkerGlobalScope",
  );
  defineToStringTag(
    ServiceWorkerGlobalScope.prototype,
    "ServiceWorkerGlobalScope",
  );
  defineToStringTag(
    SharedWorkerGlobalScope.prototype,
    "SharedWorkerGlobalScope",
  );
  installWorkerScopeHandlers();
  for (const [key, value] of [["TEMPORARY", 0], ["PERSISTENT", 1]]) {
    Object.defineProperty(DedicatedWorkerGlobalScope.prototype, key, {
      value,
      writable: false,
      enumerable: true,
      configurable: false,
    });
  }
  defineConstructorBacklink(
    DedicatedWorkerGlobalScope.prototype,
    DedicatedWorkerGlobalScope,
  );
  const globalPrototype = kind === "shared"
    ? SharedWorkerGlobalScope.prototype
    : kind === "service"
      ? ServiceWorkerGlobalScope.prototype
      : DedicatedWorkerGlobalScope.prototype;
  Object.setPrototypeOf(globalThis, globalPrototype);
  initializeEventTarget(globalThis);
  configureGPUProfile(renderingProfile ?? null);
  outbound = typeof postMessage === "function" ? postMessage : null;
  closeWorker = typeof close === "function" ? close : null;
  serviceWorkerControl = typeof control === "object" && control !== null
    ? control
    : null;
  workerClosed = false;
  workerUrl = `${url}`;
  workerName = `${name}`;
  workerType = `${type}`;
  replayRecords = [...replay];
  globalKind = `${kind}`;
  const parsedUrl = parseWorkerUrl(url);
  workerOrigin = parsedUrl.origin;
  workerSecureContext = parsedUrl.protocol === "https:";
  workerLocationValue = createWorkerLocation(parsedUrl);
  workerNavigatorValue = createWorkerNavigator(navigatorProfile);
  defineOwnWorkerGetter("name", () => workerName);
  defineWorkerScopeGetter("self", () => globalThis);
  defineWorkerScopeGetter("location", () => workerLocationValue);
  defineWorkerScopeGetter("navigator", () => workerNavigatorValue);
  defineWorkerScopeGetter("origin", () => workerOrigin);
  defineWorkerScopeGetter(
    "isSecureContext",
    () => workerSecureContext,
  );
  defineWorkerScopeGetter("crossOriginIsolated", () => false);
  installHandlers(kind);
  installGlobalMethods(kind);
  if (kind === "service") installServiceWorkerControlMethods();
}

function installWorkerScopeHandlers() {
  for (const name of [
    "onerror",
    "onlanguagechange",
    "onrejectionhandled",
    "onunhandledrejection",
  ]) {
    const descriptor = Object.getOwnPropertyDescriptor({
      get [name]() {
        return handlers.get(name) ?? null;
      },
      set [name](value) {
        handlers.set(name, typeof value === "function" ? value : null);
      },
    }, name);
    registerNativeGetter(descriptor.get, name);
    registerNativeFunction(descriptor.set, `set ${name}`);
    Object.defineProperty(WorkerGlobalScope.prototype, name, {
      get: descriptor.get,
      set: descriptor.set,
      enumerable: true,
      configurable: true,
    });
  }
}

export function receiveOwnerMessage(message, options, ports = []) {
  if (workerClosed) return;
  const cloned = performStructuredCloneDetailed(message, options);
  Promise.resolve().then(() => {
    if (workerClosed) return;
    const event = new MessageEvent("message", {
      data: cloned.value,
      ports: ports.length === 0 ? cloned.transferred : ports,
      source: globalKind === "service" ? serviceClient({
        postMessage(message, ports = []) {
          if (workerClosed || outbound === null) return;
          outbound(message, ports);
        },
      }) : null,
    });
    globalThis.dispatchEvent(event);
    const handler = handlers.get("onmessage") ?? null;
    if (handler !== null) Reflect.apply(handler, globalThis, [event]);
  });
}

export function connectSharedWorker(sendToOwner) {
  if (workerClosed) {
    return {
      deliverOwnerMessage() {},
      close() {},
    };
  }
  const channel = new MessageChannel();
  channel.port2.onmessage = event => {
    sendToOwner(event.data, event.ports);
  };
  channel.port2.start();
  Promise.resolve().then(() => {
    if (workerClosed) return;
    const event = new MessageEvent("connect", {
      ports: [channel.port1],
    });
    globalThis.dispatchEvent(event);
    const handler = handlers.get("onconnect") ?? null;
    if (handler !== null) Reflect.apply(handler, globalThis, [event]);
  });
  return {
    deliverOwnerMessage(message, ports = []) {
      if (!workerClosed) channel.port2.postMessage(message, ports);
    },
    close() {
      channel.port1.close();
      channel.port2.close();
    },
  };
}

function installHandlers(kind) {
  const names = kind === "shared"
    ? ["onconnect"]
    : kind === "service"
      ? ["oninstall", "onactivate", "onfetch", "onmessage", "onmessageerror"]
      : ["onmessage", "onmessageerror"];
  for (const name of names) {
    const descriptor = Object.getOwnPropertyDescriptor({
      get [name]() {
        return handlers.get(name) ?? null;
      },
      set [name](value) {
        handlers.set(name, typeof value === "function" ? value : null);
      },
    }, name);
    registerNativeGetter(descriptor.get, name);
    registerNativeFunction(descriptor.set, `set ${name}`);
    Object.defineProperty(globalThis, name, {
      get: descriptor.get,
      set: descriptor.set,
      enumerable: true,
      configurable: true,
    });
  }
}

export async function dispatchServiceWorkerFetch(requestInit) {
  if (globalKind !== "service" || workerClosed) return null;
  const request = new Request(requestInit.url, {
    method: requestInit.method ?? "GET",
    headers: requestInit.headers ?? undefined,
    body: ["GET", "HEAD"].includes(`${requestInit.method ?? "GET"}`.toUpperCase())
      ? undefined
      : requestInit.body ?? undefined,
  });
  let responsePromise = null;
  const waitPromises = [];
  const event = new Event("fetch");
  Object.defineProperties(event, {
    request: { value: request, enumerable: true },
    respondWith: {
      value(value) {
        responsePromise = Promise.resolve(value);
      },
      enumerable: true,
    },
    waitUntil: {
      value(value) {
        waitPromises.push(Promise.resolve(value));
      },
      enumerable: true,
    },
  });
  globalThis.dispatchEvent(event);
  const handler = handlers.get("onfetch") ?? null;
  const handlerResult = handler === null
    ? undefined
    : Reflect.apply(handler, globalThis, [event]);
  await Promise.all([
    Promise.resolve(handlerResult),
    ...waitPromises,
  ]);
  if (responsePromise === null) return null;
  const response = await responsePromise;
  const responseRecord = requireResponse(response);
  const body = await responseBytes(response);
  return {
    status: responseRecord.status,
    statusText: responseRecord.statusText,
    headers: Object.fromEntries(headersEntries(responseRecord.headers)),
    body,
    url: responseRecord.url,
    redirected: responseRecord.redirected,
    type: responseRecord.type,
  };
}

export async function dispatchServiceWorkerLifecycle(type) {
  if (globalKind !== "service" || workerClosed) return;
  const promises = [];
  const event = new Event(type);
  const waitUntil = {
    waitUntil(value) {
      promises.push(Promise.resolve(value));
    },
  }.waitUntil;
  registerNativeFunction(waitUntil, "waitUntil");
  Object.defineProperty(event, "waitUntil", {
    value: waitUntil,
    enumerable: true,
  });
  globalThis.dispatchEvent(event);
  const handler = handlers.get(`on${type}`) ?? null;
  if (handler !== null) Reflect.apply(handler, globalThis, [event]);
  await Promise.all(promises);
}

function installServiceWorkerControlMethods() {
  const skipWaiting = {
    skipWaiting() {
      serviceWorkerControl?.skipWaiting?.();
      return Promise.resolve();
    },
  }.skipWaiting;
  registerNativeFunction(skipWaiting, "skipWaiting");
  ownData("skipWaiting", skipWaiting, true);

  const clients = {
    claim() {
      serviceWorkerControl?.claim?.();
      return Promise.resolve();
    },
    matchAll(options) {
      const clients = serviceWorkerControl?.matchAll?.(options) ?? [];
      return Promise.resolve(clients.map(client => serviceClient(client)));
    },
  };
  registerNativeFunction(clients.claim, "claim");
  registerNativeFunction(clients.matchAll, "matchAll");
  ownData("clients", clients, true);
}

function installGlobalMethods(kind) {
  if (kind !== "shared") {
    const postMessage = {
      postMessage(message) {
        if (workerClosed || outbound === null) return;
        const options = normalizeTransferOptions(arguments[1]);
        const cloned = performStructuredCloneDetailed(message, options);
        outbound(
          cloned.value,
          cloned.transferred.filter(value =>
            Object.prototype.toString.call(value) === "[object MessagePort]"),
        );
      },
    }.postMessage;
    Object.defineProperty(postMessage, "length", {
      value: 1,
      configurable: true,
    });
    registerNativeFunction(postMessage, "postMessage");
    ownData("postMessage", postMessage, true);
  }

  const close = {
    close() {
      if (workerClosed) return;
      workerClosed = true;
      closeWorker?.();
    },
  }.close;
  registerNativeFunction(close, "close");
  ownData("close", close, true);

  const importScripts = {
    importScripts(...urls) {
      if (workerType === "module") {
        throw new TypeError(
          "Failed to execute 'importScripts' in a module worker.",
        );
      }
      for (const value of urls) {
        const specifier = `${value}`;
        const url = specifier.startsWith("data:")
          ? specifier
          : new URL(specifier, workerUrl).href;
        const source = workerScriptSource(url);
        (0, eval)(`${source}\n//# sourceURL=${url}`);
      }
    },
  }.importScripts;
  registerNativeFunction(importScripts, "importScripts");
  ownData("importScripts", importScripts, true);
}

function createWorkerLocation(parsed) {
  const location = Object.create(WorkerLocation.prototype);
  for (const name of [
    "href",
    "origin",
    "protocol",
    "host",
    "hostname",
    "port",
    "pathname",
    "search",
    "hash",
  ]) {
    Object.defineProperty(location, name, {
      value: parsed[name],
      enumerable: true,
    });
  }
  const toString = {
    toString() {
      if (this !== location) throw new TypeError("Illegal invocation");
      return parsed.href;
    },
  }.toString;
  registerNativeFunction(toString, "toString");
  Object.defineProperty(location, "toString", {
    value: toString,
    enumerable: true,
  });
  return location;
}

function parseWorkerUrl(url) {
  const source = `${url}`;
  if (source.startsWith("data:")) {
    return {
      href: source,
      origin: "null",
      protocol: "data:",
      host: "",
      hostname: "",
      port: "",
      pathname: source.slice(5),
      search: "",
      hash: "",
    };
  }
  return new URL(source);
}

function createWorkerNavigator(profile) {
  const navigator = Object.create(WorkerNavigator.prototype);
  for (const [name, value] of Object.entries({
    userAgent: profile.userAgent,
    appVersion: profile.appVersion ?? profile.userAgent,
    platform: profile.platform,
    language: profile.language,
    languages: Object.freeze([...profile.languages]),
    hardwareConcurrency: profile.hardwareConcurrency,
    deviceMemory: profile.deviceMemory,
    vendorSub: profile.vendorSub ?? "",
    productSub: profile.productSub ?? "20030107",
    vendor: profile.vendor ?? "Google Inc.",
    product: profile.product ?? "Gecko",
    maxTouchPoints: profile.maxTouchPoints ?? 0,
    doNotTrack: profile.doNotTrack ?? null,
    cookieEnabled: profile.cookieEnabled ?? true,
    webdriver: profile.webdriver ?? false,
    pdfViewerEnabled: profile.pdfViewerEnabled ?? true,
    userAgentData: createNavigatorUAData(),
    onLine: profile.online ?? true,
    gpu: createGPU(),
    storage: createStorageManager(),
  })) {
    Object.defineProperty(navigator, name, {
      value,
      enumerable: true,
    });
  }
  return navigator;
}

function ownData(name, value, writable) {
  Object.defineProperty(globalThis, name, {
    value,
    writable,
    enumerable: true,
    configurable: true,
  });
}

function defineOwnWorkerGetter(name, read) {
  const getter = Object.getOwnPropertyDescriptor({
    get [name]() { return read(); },
  }, name).get;
  registerNativeGetter(getter, name);
  Object.defineProperty(globalThis, name, {
    get: getter,
    enumerable: true,
    configurable: true,
  });
}

function defineWorkerScopeGetter(name, read) {
  const getter = Object.getOwnPropertyDescriptor({
    get [name]() { return read(); },
  }, name).get;
  registerNativeGetter(getter, name);
  Object.defineProperty(WorkerGlobalScope.prototype, name, {
    get: getter,
    enumerable: true,
    configurable: true,
  });
}

function normalizeTransferOptions(value) {
  if (value === undefined) return undefined;
  if (Array.isArray(value)) return { transfer: value };
  return value;
}

function serviceClient(snapshot = {}) {
  const client = {};
  const postMessage = {
    postMessage(message) {
      if (workerClosed || typeof snapshot.postMessage !== 'function') return;
      const cloned = performStructuredCloneDetailed(
        message,
        normalizeTransferOptions(arguments[1]),
      );
      snapshot.postMessage(
        cloned.value,
        cloned.transferred.filter(value =>
          Object.prototype.toString.call(value) === "[object MessagePort]"),
      );
    },
  }.postMessage;
  Object.defineProperty(postMessage, "length", {
    value: 1,
    configurable: true,
  });
  registerNativeFunction(postMessage, "postMessage");
  Object.defineProperty(client, "postMessage", {
    value: postMessage,
    enumerable: true,
  });
  for (const [name, value] of Object.entries(snapshot)) {
    if (['postMessage', 'focus', 'navigate'].includes(name)) continue;
    Object.defineProperty(client, name, {
      value,
      enumerable: true,
      configurable: true,
    });
  }
  for (const name of ['focus', 'navigate']) {
    const callback = snapshot[name];
    const method = {
      [name](...args) {
        if (workerClosed || typeof callback !== 'function') return Promise.resolve(null);
        return Promise.resolve(callback(...args)).then(value => serviceClient(value ?? snapshot));
      },
    }[name];
    registerNativeFunction(method, name);
    Object.defineProperty(client, name, {
      value: method,
      enumerable: true,
      configurable: true,
    });
  }
  Object.defineProperty(client, Symbol.toStringTag, {
    value: "WindowClient",
  });
  return client;
}

function workerScriptSource(url) {
  if (url.startsWith("data:")) return decodeDataScript(url);
  const match = replayRecords.find(entry =>
    entry.method === "GET" && entry.url === url);
  if (match === undefined) {
    throw new DOMException(
      `No offline replay entry for imported worker script: ${url}`,
      "NetworkError",
    );
  }
  return `${match.body}`;
}

function decodeDataScript(url) {
  const comma = url.indexOf(",");
  if (comma < 0) throw new DOMException("Invalid data URL.", "SyntaxError");
  const metadata = url.slice(5, comma);
  const payload = url.slice(comma + 1);
  if (!metadata.toLowerCase().endsWith(";base64")) {
    try {
      return decodeURIComponent(payload);
    } catch {
      throw new DOMException("Invalid data URL.", "SyntaxError");
    }
  }
  let binary;
  try {
    binary = atob(payload);
  } catch {
    throw new DOMException("Invalid data URL.", "SyntaxError");
  }
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return new TextDecoder().decode(bytes);
}

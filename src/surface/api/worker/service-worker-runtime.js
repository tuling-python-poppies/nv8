import {
  performStructuredCloneDetailed,
} from "../clone/structured-clone-algorithm.js";
import { Event } from "../event/event-constructor.js";
import { initializeEventTarget } from "../event/event-target-state.js";
import { MessageEvent } from "../messaging/messaging-runtime.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { createRealmSlot } from "../../../engine/core/state-scope.js";
import {
  createCookieStoreManager,
  createNavigationPreloadManager,
  createPeriodicSyncManager,
  createPushManager,
  createSyncManager,
} from "../service-worker-managers/service-worker-managers-runtime.js";
import {
  createBackgroundFetchManager,
} from "../background-fetch/background-fetch-runtime.js";

const serviceWorkerState = new WeakMap();
const registrationState = new WeakMap();
const containerState = new WeakMap();

// ServiceWorker factory、页面 URL、容器单例和初始 controller 原先是模块级
// 状态，会跨宿主图 Realm 共享。每个 Window/Worker Realm 各自拥有一份。
const serviceWorkerSlot = createRealmSlot(() => ({
  serviceWorkerFactory: null,
  serviceWorkerPageUrl: "https://sandbox.test/",
  containerSingleton: null,
  serviceWorkerEnabled: true,
  initialController: null,
}), "service-worker-runtime");

function serviceWorkerRuntimeState() {
  return serviceWorkerSlot.get(globalThis);
}

export function configureServiceWorkers(factory, pageUrl, profile = null) {
  serviceWorkerRuntimeState().serviceWorkerFactory = typeof factory === "function" ? factory : null;
  serviceWorkerRuntimeState().serviceWorkerPageUrl = `${pageUrl}`;
  serviceWorkerRuntimeState().serviceWorkerEnabled = profile?.enabled ?? true;
  serviceWorkerRuntimeState().initialController = profile?.controller ?? null;
  if (serviceWorkerRuntimeState().containerSingleton !== null) {
    applyInitialController(serviceWorkerRuntimeState().containerSingleton);
  }
}

function applyInitialController(container) {
  const state = requireContainer(container);
  if (serviceWorkerRuntimeState().initialController === null) {
    state.controller = null;
    return;
  }
  const controller = createServiceWorker(serviceWorkerRuntimeState().initialController.scriptURL);
  const controllerRecord = requireServiceWorker(controller);
  controllerRecord.state = 'activated';
  controllerRecord.handle = serviceWorkerRuntimeState().initialController.handle ?? null;
  controllerRecord.version = serviceWorkerRuntimeState().initialController.version ?? null;
  controllerRecord.scope = serviceWorkerRuntimeState().initialController.scope ?? null;
  state.controller = controller;
}

export function ServiceWorker() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(ServiceWorker, "ServiceWorker");

export function ServiceWorkerRegistration() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(ServiceWorkerRegistration, "ServiceWorkerRegistration");

export function ServiceWorkerContainer() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(ServiceWorkerContainer, "ServiceWorkerContainer");

export function createServiceWorkerContainer() {
  if (serviceWorkerRuntimeState().containerSingleton !== null) return serviceWorkerRuntimeState().containerSingleton;
  const container = Object.create(ServiceWorkerContainer.prototype);
  initializeEventTarget(container);
  let resolveReady;
  const ready = new Promise(resolve => {
    resolveReady = resolve;
  });
  const state = {
    container,
    controller: null,
    registrations: new Map(),
    handlers: new Map(),
    ready,
    resolveReady,
    readyResolved: false,
    messageQueue: [],
    messageScheduled: false,
  };
  containerState.set(container, state);
  if (serviceWorkerRuntimeState().initialController !== null) {
    const controller = createServiceWorker(serviceWorkerRuntimeState().initialController.scriptURL);
    const controllerRecord = requireServiceWorker(controller);
    controllerRecord.state = 'activated';
    controllerRecord.handle = serviceWorkerRuntimeState().initialController.handle ?? null;
    controllerRecord.version = serviceWorkerRuntimeState().initialController.version ?? null;
    controllerRecord.scope = serviceWorkerRuntimeState().initialController.scope ?? null;
    state.controller = controller;
  }
  serviceWorkerRuntimeState().containerSingleton = container;
  return container;
}

export function updateServiceWorkerController(snapshot = null) {
  if (serviceWorkerRuntimeState().containerSingleton === null) return;
  const state = requireContainer(serviceWorkerRuntimeState().containerSingleton);
  const previous = state.controller;
  if (snapshot === null) {
    state.controller = null;
  } else if (
    previous !== null
    && requireServiceWorker(previous).scriptURL === snapshot.scriptURL
    && requireServiceWorker(previous).handle === snapshot.handle
  ) {
    return;
  } else {
    const controller = createServiceWorker(snapshot.scriptURL);
    const controllerRecord = requireServiceWorker(controller);
    controllerRecord.state = 'activated';
    controllerRecord.handle = snapshot.handle ?? null;
    controllerRecord.version = snapshot.version ?? null;
    controllerRecord.scope = snapshot.scope ?? null;
    state.controller = controller;
  }
  if (previous === state.controller) return;
  const event = new Event('controllerchange');
  state.container.dispatchEvent(event);
  const handler = state.handlers.get('oncontrollerchange') ?? null;
  if (handler !== null) Reflect.apply(handler, state.container, [event]);
}

export function serviceWorkerResourceCount() {
  if (serviceWorkerRuntimeState().containerSingleton === null) return 0;
  return requireContainer(serviceWorkerRuntimeState().containerSingleton).registrations.size;
}

export function disposeServiceWorkers() {
  if (serviceWorkerRuntimeState().containerSingleton === null) return;
  const state = requireContainer(serviceWorkerRuntimeState().containerSingleton);
  for (const registration of state.registrations.values()) {
    const record = requireRegistration(registration);
    for (const worker of [record.active, record.waiting, record.installing]) {
      if (worker === null) continue;
      const workerRecord = requireServiceWorker(worker);
      workerRecord.state = 'redundant';
      workerRecord.handle?.terminate?.();
      workerRecord.handle = null;
    }
  }
  state.registrations.clear();
  state.handlers.clear();
  state.messageQueue.length = 0;
  state.controller = null;
  serviceWorkerRuntimeState().containerSingleton = null;
  serviceWorkerRuntimeState().initialController = null;
}

export function receiveServiceWorkerMessage(message, scriptURL = null, ports = []) {
  if (serviceWorkerRuntimeState().containerSingleton === null) return;
  const state = requireContainer(serviceWorkerRuntimeState().containerSingleton);
  let source = null;
  if (state.controller !== null) {
    const controller = requireServiceWorker(state.controller);
    if (scriptURL === null || controller.scriptURL === scriptURL) {
      source = state.controller;
    }
  }
  for (const registration of state.registrations.values()) {
    const record = requireRegistration(registration);
    if (source !== null || record.active === null) continue;
    const worker = requireServiceWorker(record.active);
    if (scriptURL === null || worker.scriptURL === scriptURL) {
      source = record.active;
      break;
    }
  }
  if (source === null) return;
  deliverContainerMessage(state, source, message, ports);
}

export function serviceWorkerProperty(worker, name) {
  return requireServiceWorker(worker)[name];
}

export function serviceWorkerHandler(target, name) {
  return requireMessageTarget(target).handlers.get(name) ?? null;
}

export function setServiceWorkerHandler(target, name, value) {
  requireMessageTarget(target).handlers.set(
    name,
    typeof value === "function" ? value : null,
  );
}

export function serviceWorkerPostMessage(worker, message, transferOrOptions) {
  const record = requireServiceWorker(worker);
  if (record.state === "redundant") return;
  const cloned = performStructuredCloneDetailed(
    message,
    normalizeTransferOptions(transferOrOptions),
  );
  const ports = cloned.transferred.filter(value =>
    Object.prototype.toString.call(value) === "[object MessagePort]");
  if (record.handle === null) {
    record.pending.push({ value: cloned.value, ports });
    return;
  }
  record.handle.deliverOwnerMessage(cloned.value, undefined, ports);
}

export function registrationProperty(registration, name) {
  const record = requireRegistration(registration);
  if (name in record) return record[name];
  return null;
}

export async function registrationUnregister(registration) {
  const record = requireRegistration(registration);
  if (!record.registered) return false;
  record.registered = false;
  record.container.registrations.delete(record.scope);
  if (record.container.controller === record.active) {
    record.container.controller = null;
    dispatchControllerChange(record);
  }
  if (record.active !== null) {
    const worker = requireServiceWorker(record.active);
    worker.state = "redundant";
    worker.handle?.terminate();
    worker.handle = null;
    dispatchStateChange(worker);
  }
  if (record.waiting !== null) {
    const worker = requireServiceWorker(record.waiting);
    worker.state = "redundant";
    worker.handle?.terminate?.();
    worker.handle = null;
    dispatchStateChange(worker);
    record.waiting = null;
  }
  if (record.installing !== null) {
    const worker = requireServiceWorker(record.installing);
    worker.state = "redundant";
    worker.handle?.terminate?.();
    worker.handle = null;
    dispatchStateChange(worker);
    record.installing = null;
  }
  return true;
}

export function registrationUpdate(registration) {
  const record = requireRegistration(registration);
  if (record.updatePromise !== null) return record.updatePromise;
  const promise = performRegistrationUpdate(registration);
  const updatePromise = promise.finally(() => {
    if (record.updatePromise === updatePromise) record.updatePromise = null;
  });
  record.updatePromise = updatePromise;
  return updatePromise;
}

async function performRegistrationUpdate(registration) {
  const record = requireRegistration(registration);
  if (!record.registered || serviceWorkerRuntimeState().serviceWorkerFactory === null) {
    return Promise.reject(new DOMException(
      "The service worker registration is not active.",
      "InvalidStateError",
    ));
  }
  const current = record.active === null
    ? record.installing
    : record.active;
  if (current === null) return Promise.resolve(registration);
  const currentRecord = requireServiceWorker(current);
  const nextWorker = createServiceWorker(record.scriptURL);
  const nextRecord = requireServiceWorker(nextWorker);
  nextRecord.state = "installing";
  record.installing = nextWorker;
  record.waiting = null;
  let skipWaiting = false;
  return Promise.resolve(serviceWorkerRuntimeState().serviceWorkerFactory({
    url: record.scriptURL,
    scope: record.scope,
    type: record.type,
    updateViaCache: record.updateViaCache,
    activate: false,
    onMessage(message, ports = []) {
      deliverContainerMessage(record.container, nextWorker, message, ports);
    },
    onState(state) {
      nextRecord.state = `${state}`;
      dispatchStateChange(nextRecord);
    },
    onSkipWaiting() {
      skipWaiting = true;
    },
    onClaim() {
      if (
        scopeMatches(record.scope, serviceWorkerRuntimeState().serviceWorkerPageUrl)
        && record.container.controller !== nextWorker
      ) {
        record.container.controller = nextWorker;
        dispatchControllerChange(record);
      }
    },
  })).then(async handle => {
    nextRecord.handle = handle;
    nextRecord.version = handle.version ?? null;
    record.installing = null;
    if (
      record.updateViaCache !== "none"
      && currentRecord.version !== null
      && nextRecord.version !== null
      && currentRecord.version === nextRecord.version
    ) {
      nextRecord.state = "redundant";
      handle.terminate?.();
      nextRecord.handle = null;
      dispatchStateChange(nextRecord);
      return registration;
    }
    nextRecord.state = "installed";
    if (skipWaiting) {
      await activateWaitingWorker(record, nextWorker, handle, current);
    } else {
      record.waiting = nextWorker;
    }
    return registration;
  }, error => {
    record.installing = null;
    nextRecord.state = "redundant";
    nextRecord.handle?.terminate?.();
    dispatchStateChange(nextRecord);
    throw error;
  });
}

async function activateWaitingWorker(record, worker, handle, previousWorker) {
  const workerRecord = requireServiceWorker(worker);
  if (typeof handle.activate === "function") {
    await handle.activate();
  }
  workerRecord.handle = handle;
  workerRecord.version = handle.version ?? null;
  workerRecord.state = "activated";
  for (const message of workerRecord.pending.splice(0)) {
    handle.deliverOwnerMessage(message.value, undefined, message.ports);
  }
  record.waiting = null;
  record.active = worker;
  if (previousWorker !== null && previousWorker !== worker) {
    const previousRecord = requireServiceWorker(previousWorker);
    previousRecord.state = "redundant";
    previousRecord.handle?.terminate?.({ replacing: true });
    previousRecord.handle = null;
    dispatchStateChange(previousRecord);
  }
  if (record.container.controller === previousWorker) {
    record.container.controller = worker;
    dispatchControllerChange(record);
  }
  dispatchStateChange(workerRecord);
}

export function containerProperty(container, name) {
  return requireContainer(container)[name];
}

export function containerGetRegistration(container, clientURL) {
  const record = requireContainer(container);
  const target = new URL(
    clientURL === undefined ? serviceWorkerRuntimeState().serviceWorkerPageUrl : `${clientURL}`,
    serviceWorkerRuntimeState().serviceWorkerPageUrl,
  ).href;
  let match = null;
  for (const registration of record.registrations.values()) {
    const state = requireRegistration(registration);
    if (scopeMatches(state.scope, target)) {
      if (
        match === null
        || state.scope.length > requireRegistration(match).scope.length
      ) {
        match = registration;
      }
    }
  }
  return Promise.resolve(match);
}

export function containerGetRegistrations(container) {
  return Promise.resolve([
    ...requireContainer(container).registrations.values(),
  ]);
}

export function containerRegister(container, scriptURL, options) {
  const record = requireContainer(container);
  if (!serviceWorkerRuntimeState().serviceWorkerEnabled || serviceWorkerRuntimeState().serviceWorkerFactory === null) {
    return Promise.reject(new DOMException(
      "Service workers are unavailable.",
      "NotSupportedError",
    ));
  }
  const script = resolveSameOriginUrl(scriptURL);
  const input = options ?? {};
  const type = `${input.type ?? "classic"}`;
  const updateViaCache = `${input.updateViaCache ?? "imports"}`;
  if (!["classic", "module"].includes(type)) {
    return Promise.reject(new TypeError(
      "The provided value is not a valid WorkerType.",
    ));
  }
  if (!["imports", "all", "none"].includes(updateViaCache)) {
    return Promise.reject(new TypeError(
      "The provided value is not a valid ServiceWorkerUpdateViaCache.",
    ));
  }
  const defaultScope = new URL("./", script).href;
  const scope = resolveSameOriginUrl(input.scope ?? defaultScope);
  const existing = record.registrations.get(scope);
  if (existing !== undefined) return Promise.resolve(existing);

  const worker = createServiceWorker(script);
  const registration = createRegistration(
    record,
    worker,
    scope,
    updateViaCache,
    script,
    type,
  );
  record.registrations.set(scope, registration);
  const workerRecord = requireServiceWorker(worker);
  return Promise.resolve(serviceWorkerRuntimeState().serviceWorkerFactory({
    url: script,
    scope,
    type,
    updateViaCache,
    activate: true,
    onMessage(message, ports = []) {
      deliverContainerMessage(record, worker, message, ports);
    },
    onState(state) {
      workerRecord.state = `${state}`;
      dispatchStateChange(workerRecord);
    },
    onSkipWaiting() {
      workerRecord.skipWaiting = true;
    },
    onClaim() {
      if (!scopeMatches(scope, serviceWorkerRuntimeState().serviceWorkerPageUrl)) return;
      record.controller = worker;
      dispatchControllerChange(record);
    },
  })).then(handle => {
    workerRecord.handle = handle;
    workerRecord.version = handle.version ?? null;
    workerRecord.state = "activated";
    for (const message of workerRecord.pending.splice(0)) {
      handle.deliverOwnerMessage(message.value, undefined, message.ports);
    }
    const registrationRecord = requireRegistration(registration);
    registrationRecord.installing = null;
    registrationRecord.active = worker;
    record.controller = serviceWorkerRuntimeState().serviceWorkerPageUrl.startsWith(scope) ? worker : null;
    dispatchStateChange(workerRecord);
    if (!record.readyResolved) {
      record.readyResolved = true;
      record.resolveReady(registration);
    }
    return registration;
  }, error => {
    record.registrations.delete(scope);
    workerRecord.state = "redundant";
    dispatchStateChange(workerRecord);
    throw error;
  });
}

export function containerStartMessages(container) {
  requireContainer(container);
}

function createServiceWorker(scriptURL) {
  const worker = Object.create(ServiceWorker.prototype);
  initializeEventTarget(worker);
  serviceWorkerState.set(worker, {
    worker,
    scriptURL,
    state: "installing",
    handle: null,
    pending: [],
    version: null,
    handlers: new Map(),
    skipWaiting: false,
  });
  return worker;
}

function createRegistration(
  container,
  worker,
  scope,
  updateViaCache,
  scriptURL,
  type,
) {
  const registration = Object.create(ServiceWorkerRegistration.prototype);
  initializeEventTarget(registration);
  registrationState.set(registration, {
    registration,
    container,
    installing: worker,
    waiting: null,
    active: null,
    navigationPreload: createNavigationPreloadManager(),
    backgroundFetch: createBackgroundFetchManager(),
    periodicSync: createPeriodicSyncManager(),
    sync: createSyncManager(),
    cookies: createCookieStoreManager(),
    pushManager: createPushManager(),
    scope,
    updateViaCache,
    scriptURL,
    type,
    handlers: new Map(),
    registered: true,
    updatePromise: null,
  });
  return registration;
}

function deliverContainerMessage(record, worker, message, ports) {
  const cloned = performStructuredCloneDetailed(message);
  record.messageQueue.push({
    worker,
    value: cloned.value,
    ports,
  });
  if (record.messageScheduled) return;
  record.messageScheduled = true;
  Promise.resolve().then(() => {
    record.messageScheduled = false;
    while (record.messageQueue.length > 0) {
      const queued = record.messageQueue.shift();
      const event = new MessageEvent("message", {
        data: queued.value,
        source: queued.worker,
        ports: queued.ports,
      });
      record.container.dispatchEvent(event);
      const handler = record.handlers.get("onmessage") ?? null;
      if (handler !== null) {
        Reflect.apply(handler, record.container, [event]);
      }
    }
  });
}

function dispatchControllerChange(record) {
  const event = new Event('controllerchange');
  record.container.container.dispatchEvent(event);
  const handler = record.container.handlers.get('oncontrollerchange') ?? null;
  if (handler !== null) Reflect.apply(handler, record.container, [event]);
}

function dispatchStateChange(record) {
  Promise.resolve().then(() => {
    record.worker.dispatchEvent(new Event("statechange"));
    const handler = record.handlers.get("onstatechange") ?? null;
    if (handler !== null) {
      Reflect.apply(handler, record.worker, [new Event("statechange")]);
    }
  });
}

function scopeMatches(scope, target) {
  if (target === scope) return true;
  const boundary = scope.endsWith('/') ? scope : `${scope}/`;
  return target.startsWith(boundary);
}

function resolveSameOriginUrl(value) {
  let parsed;
  try {
    parsed = new URL(`${value}`, serviceWorkerRuntimeState().serviceWorkerPageUrl);
  } catch {
    throw new DOMException("The service worker URL is invalid.", "TypeError");
  }
  const page = new URL(serviceWorkerRuntimeState().serviceWorkerPageUrl);
  if (
    parsed.origin !== page.origin
    || (parsed.protocol !== "https:" && parsed.hostname !== "localhost")
  ) {
    throw new DOMException(
      "Service workers require a secure same-origin URL.",
      "SecurityError",
    );
  }
  return parsed.href;
}

function normalizeTransferOptions(value) {
  if (value === undefined) return undefined;
  if (Array.isArray(value)) return { transfer: value };
  return value;
}

function requireServiceWorker(value) {
  const record = serviceWorkerState.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

function requireRegistration(value) {
  const record = registrationState.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

function requireContainer(value) {
  const record = containerState.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

function requireMessageTarget(value) {
  return serviceWorkerState.get(value)
    ?? registrationState.get(value)
    ?? containerState.get(value)
    ?? illegal();
}

function illegal() {
  throw new TypeError("Illegal invocation");
}

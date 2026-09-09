import { Event } from "../event/event-constructor.js";
import { initializeEventTarget } from "../event/event-target-state.js";
import { MessageChannel } from "../messaging/messaging-runtime.js";
import { DOMException } from "../event/dom-exception-constructor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";

const sharedWorkerState = new WeakMap();
const liveSharedWorkers = new Set();
const realmErrorConstructors = Object.freeze({
  EvalError,
  RangeError,
  ReferenceError,
  SyntaxError,
  TypeError,
  URIError,
});
let sharedWorkerFactory = null;
let sharedWorkerBaseUrl = "https://sandbox.test/";
let sharedWorkerDepth = 0;

export function configureSharedWorkers(factory, baseUrl, depth = 0) {
  sharedWorkerFactory = typeof factory === "function" ? factory : null;
  sharedWorkerBaseUrl = `${baseUrl}`;
  sharedWorkerDepth = Number.isSafeInteger(depth) && depth >= 0 ? depth : 0;
}

export function SharedWorker(scriptURL) {
  if (!new.target) {
    throw new TypeError("Constructor SharedWorker requires 'new'");
  }
  if (arguments.length === 0) {
    throw new TypeError("Failed to construct 'SharedWorker': 1 argument required.");
  }
  if (sharedWorkerFactory === null) {
    throw new DOMException(
      "SharedWorker creation is unavailable.",
      "NotSupportedError",
    );
  }
  const options = normalizeOptions(arguments[1]);
  const url = resolveSharedWorkerUrl(scriptURL);
  initializeEventTarget(this);
  const channel = new MessageChannel();
  const record = {
    worker: this,
    port: channel.port1,
    bridge: channel.port2,
    handle: null,
    pending: [],
    handlers: new Map(),
    closed: false,
    failed: false,
  };
  sharedWorkerState.set(this, record);
  liveSharedWorkers.add(record);
  channel.port2.onmessage = event => {
    if (record.closed || record.failed) return;
    if (record.handle === null) {
      record.pending.push({
        value: event.data,
        ports: event.ports,
      });
    } else {
      record.handle.deliverOwnerMessage(event.data, event.ports);
    }
  };
  channel.port2.start();
  Promise.resolve(sharedWorkerFactory({
    url,
    name: options.name,
    type: options.type,
    credentials: options.credentials,
    creatorOrigin: new URL(sharedWorkerBaseUrl).origin,
    workerDepth: sharedWorkerDepth + 1,
    onMessage(message, ports = []) {
      if (record.closed || record.failed) return;
      record.bridge.postMessage(message, ports);
    },
  })).then(handle => {
    if (record.closed || record.failed) {
      handle.close?.();
      return;
    }
    record.handle = handle;
    for (const message of record.pending.splice(0)) {
      handle.deliverOwnerMessage(message.value, message.ports);
    }
  }, error => {
    if (record.closed) return;
    // A failed graph must not remain visible as a live SharedWorker.
    record.failed = true;
    record.pending.splice(0);
    liveSharedWorkers.delete(record);
    record.bridge.close();
    record.port.close?.();
    deliverError(record, error);
  });
}
registerNativeFunction(SharedWorker, "SharedWorker");

export function sharedWorkerPort(worker) {
  return requireSharedWorker(worker).port;
}

export function sharedWorkerHandler(worker, name) {
  return requireSharedWorker(worker).handlers.get(name) ?? null;
}

export function setSharedWorkerHandler(worker, name, value) {
  requireSharedWorker(worker).handlers.set(
    name,
    typeof value === "function" ? value : null,
  );
}

export function sharedWorkerResourceCount() {
  return liveSharedWorkers.size;
}

export function terminateAllSharedWorkers() {
  for (const record of [...liveSharedWorkers]) {
    if (record.closed) continue;
    record.closed = true;
    record.failed = false;
    record.pending.splice(0);
    record.handle?.close();
    record.handle = null;
    record.bridge.close();
    liveSharedWorkers.delete(record);
  }
}

function normalizeOptions(value) {
  if (typeof value === "string") {
    return {
      name: value,
      type: "classic",
      credentials: "same-origin",
    };
  }
  const input = value ?? {};
  const type = `${input.type ?? "classic"}`;
  const credentials = `${input.credentials ?? "same-origin"}`;
  if (!["classic", "module"].includes(type)) {
    throw new TypeError("The provided value is not a valid WorkerType.");
  }
  if (!["omit", "same-origin", "include"].includes(credentials)) {
    throw new TypeError("The provided value is not a valid RequestCredentials.");
  }
  return {
    name: `${input.name ?? ""}`,
    type,
    credentials,
  };
}

function resolveSharedWorkerUrl(value) {
  const source = `${value}`;
  if (source.startsWith("data:") || source.startsWith("blob:")) return source;
  let parsed;
  try {
    parsed = new URL(source, sharedWorkerBaseUrl);
  } catch {
    throw new DOMException("The shared worker URL is invalid.", "SyntaxError");
  }
  const owner = new URL(sharedWorkerBaseUrl);
  if (parsed.origin !== owner.origin) {
    throw new DOMException(
      "The shared worker script must use the creator's origin.",
      "SecurityError",
    );
  }
  return parsed.href;
}

function deliverError(record, error) {
  Promise.resolve().then(() => {
    if (record.closed) return;
    const localError = localizeWorkerError(error);
    const event = new Event("error", { cancelable: true });
    Object.defineProperties(event, {
      message: { value: localError.message, enumerable: true },
      error: { value: localError, enumerable: true },
    });
    record.worker.dispatchEvent(event);
    const handler = record.handlers.get("onerror") ?? null;
    if (handler !== null) Reflect.apply(handler, record.worker, [event]);
  });
}

function localizeWorkerError(error) {
  const message = `${error?.message ?? error}`;
  if (Object.prototype.toString.call(error) === "[object DOMException]") {
    return new DOMException(message, `${error?.name ?? "Error"}`);
  }
  const Constructor = realmErrorConstructors[error?.name] ?? Error;
  const localError = new Constructor(message);
  if (error?.code !== undefined) {
    Object.defineProperty(localError, 'code', {
      value: `${error.code}`,
      enumerable: true,
    });
  }
  if (error?.details !== undefined) {
    Object.defineProperty(localError, 'details', {
      value: error.details,
      enumerable: true,
    });
  }
  return localError;
}

function requireSharedWorker(value) {
  const record = sharedWorkerState.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

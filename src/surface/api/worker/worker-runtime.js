import {
  performStructuredCloneDetailed,
} from "../clone/structured-clone-algorithm.js";
import { Event } from "../event/event-constructor.js";
import { initializeEventTarget } from "../event/event-target-state.js";
import { MessageEvent } from "../messaging/messaging-runtime.js";
import { DOMException } from "../event/dom-exception-constructor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";

const workerState = new WeakMap();
const liveWorkers = new Set();
const realmErrorConstructors = Object.freeze({
  EvalError,
  RangeError,
  ReferenceError,
  SyntaxError,
  TypeError,
  URIError,
});
let workerFactory = null;
let workerBaseUrl = "https://sandbox.test/";
let workerDepth = 0;

export function configureWorkers(factory, baseUrl, depth = 0) {
  workerFactory = typeof factory === "function" ? factory : null;
  workerBaseUrl = `${baseUrl}`;
  workerDepth = Number.isSafeInteger(depth) && depth >= 0 ? depth : 0;
}

export function Worker(scriptURL) {
  if (!new.target) throw new TypeError("Constructor Worker requires 'new'");
  if (arguments.length === 0) {
    throw new TypeError(
      "Failed to construct 'Worker': 1 argument required, but only 0 present.",
    );
  }
  if (workerFactory === null) {
    throw new DOMException("Worker creation is unavailable.", "NotSupportedError");
  }
  const options = arguments[1] ?? {};
  const url = resolveWorkerUrl(scriptURL);
  const type = `${options.type ?? "classic"}`;
  if (type !== "classic" && type !== "module") {
    throw new TypeError(
      `Failed to construct 'Worker': Failed to read the 'type' property from `
      + `'WorkerOptions': The provided value '${type}' is not a valid enum value of type WorkerType.`,
    );
  }
  const credentials = `${options.credentials ?? "same-origin"}`;
  if (!["omit", "same-origin", "include"].includes(credentials)) {
    throw new TypeError(
      `Failed to construct 'Worker': Failed to read the 'credentials' property from `
      + `'WorkerOptions': The provided value '${credentials}' is not a valid enum value of type RequestCredentials.`,
    );
  }
  initializeEventTarget(this);
  const record = {
    worker: this,
    url,
    handle: null,
    terminated: false,
    failed: false,
    pending: [],
    handlers: new Map(),
  };
  workerState.set(this, record);
  liveWorkers.add(record);
  Promise.resolve(workerFactory({
    url,
    type,
    credentials,
    name: `${options.name ?? ""}`,
    creatorOrigin: new URL(workerBaseUrl).origin,
    workerDepth: workerDepth + 1,
    onMessage(message, ports = []) {
      deliverMessage(record, message, ports);
    },
    onError(error) {
      deliverError(record, error);
    },
  })).then(handle => {
    if (record.terminated || record.failed) {
      handle.terminate?.();
      return;
    }
    record.handle = handle;
    for (const entry of record.pending.splice(0)) {
      handle.deliverOwnerMessage(entry.value, undefined, entry.ports);
    }
  }, error => {
    if (record.terminated) return;
    // A failed construction no longer represents a live Worker. Keep the
    // record long enough to dispatch the browser-visible error, but do not
    // retain it in the resource count or accept messages into a dead queue.
    record.failed = true;
    record.pending.splice(0);
    liveWorkers.delete(record);
    deliverError(record, error);
  });
}
registerNativeFunction(Worker, "Worker");

export function workerHandler(worker, name) {
  return requireWorker(worker).handlers.get(name) ?? null;
}

export function setWorkerHandler(worker, name, value) {
  requireWorker(worker).handlers.set(
    name,
    typeof value === "function" ? value : null,
  );
}

export function workerPostMessage(worker, message, transferOrOptions) {
  const record = requireWorker(worker);
  if (record.terminated || record.failed) return;
  const cloned = performStructuredCloneDetailed(
    message,
    normalizeTransferOptions(transferOrOptions),
  );
  const ports = cloned.transferred.filter(value =>
    Object.prototype.toString.call(value) === "[object MessagePort]");
  if (record.handle === null) {
    record.pending.push({ value: cloned.value, ports });
  } else {
    record.handle.deliverOwnerMessage(cloned.value, undefined, ports);
  }
}

export function workerTerminate(worker) {
  const record = requireWorker(worker);
  if (record.terminated) return;
  record.terminated = true;
  record.failed = false;
  liveWorkers.delete(record);
  record.pending.splice(0);
  record.handle?.terminate();
  record.handle = null;
}

export function workerResourceCount() {
  return liveWorkers.size;
}

export function terminateAllWorkers() {
  for (const record of [...liveWorkers]) {
    if (record.terminated) continue;
    record.terminated = true;
    record.failed = false;
    record.pending.splice(0);
    record.handle?.terminate();
    record.handle = null;
    liveWorkers.delete(record);
  }
}

function deliverMessage(record, message, ports) {
  if (record.terminated) return;
  const cloned = performStructuredCloneDetailed(message);
  Promise.resolve().then(() => {
    if (record.terminated) return;
    const event = new MessageEvent("message", {
      data: cloned.value,
      ports,
    });
    record.worker.dispatchEvent(event);
    const handler = record.handlers.get("onmessage") ?? null;
    if (handler !== null) Reflect.apply(handler, record.worker, [event]);
  });
}

function deliverError(record, error) {
  if (record.terminated) return;
  Promise.resolve().then(() => {
    if (record.terminated) return;
    const localError = localizeWorkerError(error);
    const event = new Event("error", { cancelable: true });
    Object.defineProperties(event, {
      message: {
        value: localError.message,
        enumerable: true,
      },
      error: {
        value: localError,
        enumerable: true,
      },
    });
    record.worker.dispatchEvent(event);
    const handler = record.handlers.get("onerror") ?? null;
    if (handler !== null) Reflect.apply(handler, record.worker, [event]);
  });
}

function localizeWorkerError(error) {
  const message = `${error?.message ?? error}`;
  if (
    error?.nv8Code === undefined
    && Object.prototype.toString.call(error) === "[object DOMException]"
  ) {
    return new DOMException(message, `${error?.name ?? "Error"}`);
  }
  const Constructor = realmErrorConstructors[error?.name] ?? Error;
  const localError = new Constructor(message);
  if (error?.nv8Code !== undefined) {
    Object.defineProperty(localError, 'code', {
      value: `${error.nv8Code}`,
      enumerable: true,
    });
  } else if (error?.code !== undefined) {
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

function resolveWorkerUrl(value) {
  const source = `${value}`;
  if (source.startsWith("data:") || source.startsWith("blob:")) {
    return source;
  }
  let parsed;
  try {
    parsed = new URL(source, workerBaseUrl);
  } catch {
    throw new DOMException("The worker script URL is invalid.", "SyntaxError");
  }
  if (!["http:", "https:", "data:", "blob:"].includes(parsed.protocol)) {
    throw new DOMException("The worker script scheme is unsupported.", "SecurityError");
  }
  const owner = new URL(workerBaseUrl);
  if (
    (parsed.protocol === "http:" || parsed.protocol === "https:")
    && parsed.origin !== owner.origin
  ) {
    throw new DOMException(
      "The worker script must use the creator's origin.",
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

function requireWorker(value) {
  const record = workerState.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

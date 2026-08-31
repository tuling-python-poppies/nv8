import { initializeDOMException } from "../event/dom-exception-state.js";
import { initializeEventTarget } from "../event/event-target-state.js";
import { Event } from "../event/event-constructor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";

const state = new WeakMap();

export function WebSocket(url) {
  requireNew(new.target, "WebSocket");
  const normalized = socketURL(url, ["ws:", "wss:"]);
  initializeEventTarget(this);
  state.set(this, {
    kind: "webSocket",
    object: this,
    url: normalized,
    readyState: 0,
    bufferedAmount: 0,
    extensions: "",
    protocol: "",
    binaryType: "blob",
    handlers: handlers(["onopen", "onerror", "onclose", "onmessage"]),
  });
  scheduleUnavailable(state.get(this));
}
export function EventSource(url) {
  requireNew(new.target, "EventSource");
  const init = arguments[1] ?? {};
  initializeEventTarget(this);
  state.set(this, {
    kind: "eventSource",
    object: this,
    url: socketURL(url, ["http:", "https:"]),
    withCredentials: Boolean(init.withCredentials),
    readyState: 0,
    handlers: handlers(["onopen", "onmessage", "onerror"]),
  });
  scheduleUnavailable(state.get(this));
}
export function WebSocketError() {
  requireNew(new.target, "WebSocketError");
  const message = `${arguments[0] ?? "WebSocket connection unavailable"}`;
  const init = arguments[1] ?? {};
  initializeDOMException(this, message, "WebSocketError");
  state.set(this, {
    kind: "webSocketError",
    closeCode: Number(init.closeCode ?? 1006),
    reason: `${init.reason ?? message}`,
  });
}
export function WebSocketStream(url) {
  requireNew(new.target, "WebSocketStream");
  const normalized = socketURL(url, ["ws:", "wss:"]);
  let resolveClosed;
  const error = new WebSocketError("Network sockets are disabled", {
    closeCode: 1006,
    reason: "Network sockets are disabled",
  });
  const opened = Promise.reject(error);
  opened.catch(() => {});
  const closed = new Promise(resolve => {
    resolveClosed = resolve;
  });
  state.set(this, {
    kind: "webSocketStream",
    url: normalized,
    opened,
    closed,
    resolveClosed,
    closedState: false,
  });
  Promise.resolve().then(() => closeStream(state.get(this), 1006, error.reason));
}

export const offlineSocketConstructors = Object.freeze([
  WebSocket,
  EventSource,
  WebSocketError,
  WebSocketStream,
]);
for (const Constructor of offlineSocketConstructors) {
  registerNativeFunction(Constructor, Constructor.name);
}

export function offlineSocketProperty(value, name) {
  const record = requireRecord(value);
  if (record.handlers?.has(name)) return record.handlers.get(name);
  return record[name];
}

export function setOfflineSocketProperty(value, name, input) {
  const record = requireRecord(value);
  if (record.handlers?.has(name)) {
    record.handlers.set(name, typeof input === "function" ? input : null);
    return;
  }
  if (record.kind === "webSocket" && name === "binaryType") {
    const normalized = `${input}`;
    if (!["blob", "arraybuffer"].includes(normalized)) return;
    record.binaryType = normalized;
  }
}

export function offlineSocketOperation(value, name, args) {
  const record = requireRecord(value);
  if (record.kind === "webSocket") {
    if (name === "send") {
      throw new DOMException("The WebSocket is not open.", "InvalidStateError");
    }
    if (name === "close") {
      closeSocket(record, Number(args[0] ?? 1000), `${args[1] ?? ""}`);
      return;
    }
  }
  if (record.kind === "eventSource" && name === "close") {
    record.readyState = 2;
    return;
  }
  if (record.kind === "webSocketStream" && name === "close") {
    const init = args[0] ?? {};
    closeStream(record, Number(init.closeCode ?? 1000), `${init.reason ?? ""}`);
    return;
  }
  throw new TypeError(`Unsupported offline socket operation: ${name}`);
}

function scheduleUnavailable(record) {
  Promise.resolve().then(() => {
    if (record.readyState !== 0) return;
    record.readyState = record.kind === "webSocket" ? 3 : 2;
    emit(record, "error", "onerror");
    if (record.kind === "webSocket") emit(record, "close", "onclose");
  });
}

function closeSocket(record, code, reason) {
  if (record.readyState === 3) return;
  if (code !== 1000 && (code < 3000 || code > 4999)) {
    throw new DOMException("Invalid WebSocket close code.", "InvalidAccessError");
  }
  record.readyState = 3;
  record.closeCode = code;
  record.closeReason = reason;
  emit(record, "close", "onclose");
}

function closeStream(record, closeCode, reason) {
  if (record.closedState) return;
  record.closedState = true;
  record.resolveClosed(Object.freeze({ closeCode, reason }));
}

function emit(record, type, handlerName) {
  const event = new Event(type);
  record.object.dispatchEvent(event);
  const handler = record.handlers.get(handlerName);
  if (handler !== null) Reflect.apply(handler, record.object, [event]);
}

function socketURL(value, schemes) {
  const normalized = new URL(`${value}`, globalThis.location?.href).href;
  if (!schemes.includes(new URL(normalized).protocol)) {
    throw new DOMException("The URL scheme is unsupported.", "SyntaxError");
  }
  return normalized;
}

function handlers(names) {
  return new Map(names.map(name => [name, null]));
}

function requireRecord(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

function requireNew(newTarget, name) {
  if (newTarget === undefined) {
    throw new TypeError(`Failed to construct '${name}': use new`);
  }
}

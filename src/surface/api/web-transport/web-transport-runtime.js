import { initializeDOMException } from "../event/dom-exception-state.js";
import {
  ReadableStream,
  WritableStream,
} from "../streams/stream-runtime.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";

const state = new WeakMap();

export function WebTransport(url) {
  if (new.target === undefined || arguments.length < 1) {
    throw new TypeError("WebTransport requires a URL");
  }
  const href = `${url}`;
  if (!href.startsWith("https://")) {
    throw new TypeError("WebTransport URL must use https");
  }
  let resolveClosed;
  const closed = new Promise(resolve => {
    resolveClosed = resolve;
  });
  state.set(this, {
    kind: "transport",
    incomingUnidirectionalStreams: new ReadableStream(),
    incomingBidirectionalStreams: new ReadableStream(),
    datagrams: createDatagrams(),
    ready: Promise.resolve(),
    closed,
    resolveClosed,
    protocol: "",
    active: true,
  });
}

export function WebTransportBidirectionalStream() {
  throw new TypeError("Illegal constructor");
}

export function WebTransportDatagramDuplexStream() {
  throw new TypeError("Illegal constructor");
}

export function WebTransportError() {
  if (new.target === undefined) {
    // 真实 Chromium 的文案带 `Failed to construct 'X': ` 前缀
    throw new TypeError("Failed to construct 'WebTransportError': Please use the 'new' operator, this DOM object constructor cannot be called as a function.");
  }
  const init = arguments[0] !== null && typeof arguments[0] === "object"
    ? arguments[0]
    : {};
  const message = `${init.message ?? ""}`;
  const source = `${init.source ?? "stream"}`;
  const code = init.streamErrorCode === undefined
    ? null
    : Number(init.streamErrorCode) >>> 0;
  initializeDOMException(this, message, "NetworkError");
  state.set(this, {
    kind: "error",
    streamErrorCode: code,
    source,
  });
}

export const webTransportConstructors = Object.freeze([
  WebTransport,
  WebTransportBidirectionalStream,
  WebTransportDatagramDuplexStream,
  WebTransportError,
]);
for (const Constructor of webTransportConstructors) {
  registerNativeFunction(Constructor, Constructor.name);
}

export function webTransportProperty(value, name) {
  return requireRecord(value)[name];
}

export function setWebTransportProperty(value, name, input) {
  const record = requireRecord(value);
  if (record.kind !== "datagrams") throw new TypeError("Illegal invocation");
  if (name === "incomingMaxAge" || name === "outgoingMaxAge") {
    record[name] = input === null ? null : Number(input);
  } else if (
    name === "incomingHighWaterMark"
    || name === "outgoingHighWaterMark"
    // Edge 151 新增的两个 datagram 缓冲上限，语义与 HighWaterMark 同类
    || name === "incomingMaxBufferedDatagrams"
    || name === "outgoingMaxBufferedDatagrams"
  ) {
    const number = Number(input);
    record[name] = Number.isNaN(number) ? 1 : number;
  } else {
    throw new TypeError("Illegal invocation");
  }
}

export function webTransportOperation(value, name) {
  const record = requireRecord(value);
  if (record.kind !== "transport") throw new TypeError("Illegal invocation");
  if (name === "close") {
    record.active = false;
    record.resolveClosed();
    return undefined;
  }
  if (!record.active) throw new TypeError("WebTransport is closed");
  if (name === "createBidirectionalStream") {
    return Promise.resolve(createBidirectionalStream());
  }
  if (name === "createUnidirectionalStream") {
    return Promise.resolve(new WritableStream());
  }
  throw new TypeError(`Unsupported WebTransport operation: ${name}`);
}

function createBidirectionalStream() {
  return create(WebTransportBidirectionalStream, {
    kind: "bidirectional",
    readable: new ReadableStream(),
    writable: new WritableStream(),
  });
}

function createDatagrams() {
  return create(WebTransportDatagramDuplexStream, {
    kind: "datagrams",
    readable: new ReadableStream(),
    writable: new WritableStream(),
    maxDatagramSize: 1200,
    incomingMaxAge: null,
    outgoingMaxAge: null,
    incomingHighWaterMark: 1,
    outgoingHighWaterMark: 1,
    incomingMaxBufferedDatagrams: 1,
    outgoingMaxBufferedDatagrams: 1,
  });
}

function create(Constructor, record) {
  const value = Object.create(Constructor.prototype);
  state.set(value, record);
  return value;
}

function requireRecord(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

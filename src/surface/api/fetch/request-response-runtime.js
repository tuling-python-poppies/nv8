import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { createBlob, decodeUtf8, encodeUtf8, requireBlob } from "../file/blob-state.js";
import { FormData, formDataAppend, requireFormData } from "./form-data-runtime.js";
import { Headers, cloneHeaders, headersGet, headersHas, headersSet } from "./headers-runtime.js";

const requestState = new WeakMap();
const responseState = new WeakMap();

export function Request(input) {
  if (!new.target) throw new TypeError("Constructor Request requires 'new'");
  const init = arguments[1] ?? {};
  const source = requestState.get(input);
  const url = source === undefined
    ? resolveURL(input)
    : source.url;
  const body = bodyRecord(
    Object.hasOwn(init, "body") ? init.body : source?.bytes ?? null,
  );
  const method = `${init.method ?? source?.method ?? "GET"}`.toUpperCase();
  if ((method === "GET" || method === "HEAD") && body.bytes.length > 0) {
    throw new TypeError(
      "Failed to construct 'Request': Request with GET/HEAD method cannot have body.",
    );
  }
  const headers = new Headers(init.headers ?? source?.headers);
  applyBodyContentType(headers, body.type);
  requestState.set(this, {
    method,
    url,
    headers,
    destination: source?.destination ?? "",
    referrer: `${init.referrer ?? source?.referrer ?? "about:client"}`,
    referrerPolicy: `${init.referrerPolicy ?? source?.referrerPolicy ?? ""}`,
    mode: `${init.mode ?? source?.mode ?? "cors"}`,
    credentials: `${init.credentials ?? source?.credentials ?? "same-origin"}`,
    cache: `${init.cache ?? source?.cache ?? "default"}`,
    redirect: `${init.redirect ?? source?.redirect ?? "follow"}`,
    integrity: `${init.integrity ?? source?.integrity ?? ""}`,
    keepalive: Boolean(init.keepalive ?? source?.keepalive ?? false),
    signal: init.signal ?? source?.signal ?? new AbortController().signal,
    duplex: `${init.duplex ?? source?.duplex ?? "half"}`,
    targetAddressSpace: `${init.targetAddressSpace
      ?? source?.targetAddressSpace
      ?? "unknown"}`,
    bytes: body.bytes,
    body: body.bytes.length === 0 ? null : byteStream(body.bytes),
    bodyUsed: false,
  });
}
registerNativeFunction(Request, "Request");

export function Response() {
  if (!new.target) throw new TypeError("Constructor Response requires 'new'");
  const body = bodyRecord(arguments[0] ?? null);
  const init = arguments[1] ?? {};
  const status = Number(init.status ?? 200);
  if (!Number.isInteger(status) || status < 200 || status > 599) {
    throw new RangeError("The status is outside the range 200 to 599");
  }
  const headers = new Headers(init.headers);
  applyBodyContentType(headers, body.type);
  responseState.set(this, {
    type: "default",
    url: "",
    redirected: false,
    status,
    statusText: `${init.statusText ?? ""}`,
    headers,
    bytes: body.bytes,
    body: body.bytes.length === 0 ? null : byteStream(body.bytes),
    bodyUsed: false,
  });
}
registerNativeFunction(Response, "Response");

export function requestProperty(request, name) {
  const state = requireRequest(request);
  if (name === "isHistoryNavigation" || name === "isReloadNavigation") return false;
  if (name === "bodyUsed") return state.bodyUsed;
  return state[name];
}

export function responseProperty(response, name) {
  const state = requireResponse(response);
  if (name === "ok") return state.status >= 200 && state.status <= 299;
  if (name === "bodyUsed") return state.bodyUsed;
  return state[name];
}

export function requestArrayBuffer(request) {
  return consume(requestState, request, bytes =>
    bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
}

export function requestBlob(request) {
  return consume(requestState, request, (bytes, state) =>
    createBlob(bytes, headersGet(state.headers, "content-type") ?? ""));
}

export function requestClone(request) {
  const state = requireRequest(request);
  if (state.bodyUsed) throw new TypeError("The body has already been used");
  return new Request(request);
}

export function requestFormData(request) {
  return consume(requestState, request, (bytes, state) =>
    parseFormData(bytes, headersGet(state.headers, "content-type")));
}

export function requestJSON(request) {
  return consume(requestState, request, bytes => JSON.parse(decodeUtf8(bytes)));
}

export function requestText(request) {
  return consume(requestState, request, decodeUtf8);
}

/**
 * `Request.prototype.textStream()` —— Edge 151 新增。
 *
 * 真实 Edge 实测是**方法**而非访问器。与 `text()` 的区别：`text()` 返回
 * `Promise<string>`，`textStream()` 同步返回一个产出已解码字符串块的
 * `ReadableStream`。
 *
 * @param {object} request
 * @returns {ReadableStream}
 */
export function requestTextStream(request) {
  return consumeAsTextStream(requestState, request);
}

export function requestBytes(request) {
  return consume(requestState, request, bytes => bytes.slice());
}

/**
 * `Response.prototype.textStream()` —— Edge 151 新增，语义同 Request 侧。
 *
 * @param {object} response
 * @returns {ReadableStream}
 */
export function responseTextStream(response) {
  return consumeAsTextStream(responseState, response);
}

export function responseArrayBuffer(response) {
  return consume(responseState, response, bytes =>
    bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
}

export function responseBlob(response) {
  return consume(responseState, response, (bytes, state) =>
    createBlob(bytes, headersGet(state.headers, "content-type") ?? ""));
}

export function responseClone(response) {
  const state = requireResponse(response);
  if (state.bodyUsed) throw new TypeError("The body has already been used");
  const clone = new Response(state.bytes.slice(), {
    status: state.status,
    statusText: state.statusText,
    headers: state.headers,
  });
  const cloneState = requireResponse(clone);
  cloneState.type = state.type;
  cloneState.url = state.url;
  cloneState.redirected = state.redirected;
  return clone;
}

export function responseFormData(response) {
  return consume(responseState, response, (bytes, state) =>
    parseFormData(bytes, headersGet(state.headers, "content-type")));
}

export function responseJSON(response) {
  return consume(responseState, response, bytes => JSON.parse(decodeUtf8(bytes)));
}

export function responseText(response) {
  return consume(responseState, response, decodeUtf8);
}

export function responseBytes(response) {
  return consume(responseState, response, bytes => bytes.slice());
}

export function createReplayResponse(body, init = {}, metadata = {}) {
  const response = new Response(body, init);
  const state = requireResponse(response);
  state.url = `${metadata.url ?? ""}`;
  state.redirected = Boolean(metadata.redirected);
  state.type = `${metadata.type ?? "basic"}`;
  return response;
}

export function requireRequest(value) {
  const state = requestState.get(value);
  if (state === undefined) throw new TypeError("Illegal invocation");
  return state;
}

export function requireResponse(value) {
  const state = responseState.get(value);
  if (state === undefined) throw new TypeError("Illegal invocation");
  return state;
}

/**
 * 把请求/响应体一次性解码成字符串，包成 ReadableStream。
 *
 * 与 `consume()` 共享「体只能用一次」的约束，但同步返回流而不是 Promise——
 * 真实浏览器的 `textStream()` 也是同步返回流。
 *
 * @param {WeakMap} map
 * @param {object} value
 * @returns {ReadableStream}
 */
function consumeAsTextStream(map, value) {
  const state = map.get(value);
  if (state === undefined) throw new TypeError("Illegal invocation");
  if (state.bodyUsed) throw new TypeError("Body has already been used");
  state.bodyUsed = true;
  const text = decodeUtf8(state.bytes.slice());
  return new ReadableStream({
    start(controller) {
      controller.enqueue(text);
      controller.close();
    },
  });
}

function consume(map, value, operation) {
  const state = map.get(value);
  if (state === undefined) throw new TypeError("Illegal invocation");
  if (state.bodyUsed) return Promise.reject(new TypeError("Body has already been used"));
  state.bodyUsed = true;
  return Promise.resolve(operation(state.bytes.slice(), state));
}

function bodyRecord(value) {
  if (value === null || value === undefined) return { bytes: new Uint8Array(), type: "" };
  try {
    const blob = requireBlob(value);
    return { bytes: blob.bytes.slice(), type: blob.type };
  } catch {
    // Continue through other BodyInit forms.
  }
  if (value instanceof ArrayBuffer) {
    return { bytes: new Uint8Array(value.slice(0)), type: "" };
  }
  if (ArrayBuffer.isView(value)) {
    return {
      bytes: new Uint8Array(
        value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength),
      ),
      type: "",
    };
  }
  if (value instanceof URLSearchParams) {
    return {
      bytes: encodeUtf8(value.toString()),
      type: "application/x-www-form-urlencoded;charset=UTF-8",
    };
  }
  try {
    const entries = requireFormData(value);
    const parameters = new URLSearchParams();
    for (const [name, item] of entries) {
      if (typeof item === "string") parameters.append(name, item);
    }
    return {
      bytes: encodeUtf8(parameters.toString()),
      type: "application/x-www-form-urlencoded;charset=UTF-8",
    };
  } catch {
    return { bytes: encodeUtf8(value), type: "text/plain;charset=UTF-8" };
  }
}

function byteStream(bytes) {
  const copy = bytes.slice();
  return new ReadableStream({
    type: "bytes",
    start(controller) {
      controller.enqueue(copy);
      controller.close();
    },
  });
}

function parseFormData(bytes, contentType) {
  const form = new FormData();
  if ((contentType ?? "").toLowerCase().startsWith(
    "application/x-www-form-urlencoded",
  )) {
    for (const [name, value] of new URLSearchParams(decodeUtf8(bytes))) {
      formDataAppend(form, name, value);
    }
  }
  return form;
}

function resolveURL(input) {
  const source = `${input}`;
  const base = globalThis.location?.href ?? "https://sandbox.test/";
  return new URL(source, base).href;
}

function applyBodyContentType(headers, type) {
  if (type !== "" && !headersHas(headers, "content-type")) {
    headersSet(headers, "content-type", type);
  }
}

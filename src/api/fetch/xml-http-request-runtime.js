import { initializeEventTarget } from "../event/event-target-state.js";
import { createBlob, decodeUtf8 } from "../file/blob-state.js";
import { Headers, headersAppend, headersEntries, headersGet } from "./headers-runtime.js";
import {
  replayRequest,
  replayRequestWithServiceWorker,
} from "./fetch-replay.js";
import { Request, requireResponse } from "./request-response-runtime.js";
import { registerNativeFunction } from "../../webidl/native-function.js";

const state = new WeakMap();
const targetState = new WeakMap();

export function XMLHttpRequestEventTarget() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(XMLHttpRequestEventTarget, "XMLHttpRequestEventTarget");

export function XMLHttpRequestUpload() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(XMLHttpRequestUpload, "XMLHttpRequestUpload");

export function XMLHttpRequest() {
  if (!new.target) throw new TypeError("Constructor XMLHttpRequest requires 'new'");
  initializeEventTarget(this);
  initializeTarget(this);
  const upload = Object.create(XMLHttpRequestUpload.prototype);
  initializeEventTarget(upload);
  initializeTarget(upload);
  state.set(this, {
    readyState: 0,
    timeout: 0,
    withCredentials: false,
    upload,
    responseURL: "",
    status: 0,
    statusText: "",
    responseType: "",
    response: null,
    responseText: "",
    responseXML: null,
    method: "",
    url: "",
    async: true,
    requestHeaders: new Headers(),
    responseHeaders: new Headers(),
    sent: false,
    mimeType: "",
    operation: 0,
    attribution: null,
    privateToken: null,
  });
}
registerNativeFunction(XMLHttpRequest, "XMLHttpRequest");

export function xhrTargetHandler(target, name) {
  return requireTarget(target).handlers.get(name) ?? null;
}

export function setXHRTargetHandler(target, name, value) {
  requireTarget(target).handlers.set(name, typeof value === "function" ? value : null);
}

export function xhrProperty(xhr, name) {
  return requireXHR(xhr)[name];
}

export function setXHRProperty(xhr, name, value) {
  const record = requireXHR(xhr);
  if (name === "timeout") record.timeout = Math.max(0, Number(value) >>> 0);
  else if (name === "withCredentials") record.withCredentials = Boolean(value);
  else if (name === "responseType") record.responseType = `${value}`;
  else setXHRTargetHandler(xhr, name, value);
}

export function xhrAbort(xhr) {
  const record = requireXHR(xhr);
  record.operation += 1;
  record.sent = false;
  if (record.readyState !== 0 && record.readyState !== 4) {
    record.readyState = 4;
    dispatch(xhr, "readystatechange");
    dispatch(xhr, "abort");
    dispatch(xhr, "loadend");
  }
  record.readyState = 0;
}

export function xhrGetAllResponseHeaders(xhr) {
  const record = requireXHR(xhr);
  if (record.readyState < 2) return "";
  return [...headersEntries(record.responseHeaders)]
    .filter(([name]) => name !== "set-cookie")
    .map(([name, value]) => `${name}: ${value}\r\n`)
    .join("");
}

export function xhrGetResponseHeader(xhr, name) {
  const record = requireXHR(xhr);
  return record.readyState < 2 ? null : headersGet(record.responseHeaders, name);
}

export function xhrOpen(xhr, method, url, async = true) {
  const record = requireXHR(xhr);
  record.method = `${method}`.toUpperCase();
  record.url = new URL(`${url}`, globalThis.location?.href ?? "https://sandbox.test/").href;
  record.async = Boolean(async);
  record.requestHeaders = new Headers();
  record.responseHeaders = new Headers();
  record.response = null;
  record.responseText = "";
  record.responseXML = null;
  record.status = 0;
  record.statusText = "";
  record.responseURL = "";
  record.sent = false;
  record.readyState = 1;
  dispatch(xhr, "readystatechange");
}

export function xhrOverrideMimeType(xhr, mime) {
  requireXHR(xhr).mimeType = `${mime}`;
}

export function xhrSend(xhr, body = null) {
  const record = requireXHR(xhr);
  if (record.readyState !== 1 || record.sent) {
    throw new DOMException("The object's state must be OPENED.", "InvalidStateError");
  }
  record.sent = true;
  record.operation += 1;
  const operation = record.operation;
  dispatch(xhr, "loadstart");
  const execute = async () => {
    if (record.operation !== operation) return;
    try {
      const request = new Request(record.url, {
        method: record.method,
        headers: record.requestHeaders,
        body: ["GET", "HEAD"].includes(record.method) ? undefined : body,
      });
      const response = record.async
        ? await replayRequestWithServiceWorker(request, "XMLHttpRequest")
        : replayRequest(request, "XMLHttpRequest");
      applyResponse(xhr, response);
    } catch (error) {
      record.readyState = 4;
      record.status = 0;
      record.statusText = "";
      dispatch(xhr, "readystatechange");
      dispatch(xhr, "error");
      dispatch(xhr, "loadend");
    }
  };
  if (record.async) Promise.resolve().then(execute);
  else execute();
}

export function xhrSetRequestHeader(xhr, name, value) {
  const record = requireXHR(xhr);
  if (record.readyState !== 1 || record.sent) {
    throw new DOMException("The object's state must be OPENED.", "InvalidStateError");
  }
  headersAppend(record.requestHeaders, name, value);
}

export function xhrSetAttributionReporting(xhr, options) {
  requireXHR(xhr).attribution = options;
}

export function xhrSetPrivateToken(xhr, options) {
  requireXHR(xhr).privateToken = options;
}

function applyResponse(xhr, response) {
  const record = requireXHR(xhr);
  const responseRecord = requireResponse(response);
  record.responseURL = responseRecord.url;
  record.status = responseRecord.status;
  record.statusText = responseRecord.statusText;
  record.responseHeaders = new Headers(responseRecord.headers);
  record.readyState = 2;
  dispatch(xhr, "readystatechange");
  record.readyState = 3;
  dispatch(xhr, "readystatechange");
  const bytes = responseRecord.bytes.slice();
  const text = decodeUtf8(bytes);
  record.responseText = text;
  if (record.responseType === "" || record.responseType === "text") {
    record.response = text;
  } else if (record.responseType === "arraybuffer") {
    record.response = bytes.buffer.slice(
      bytes.byteOffset,
      bytes.byteOffset + bytes.byteLength,
    );
  } else if (record.responseType === "blob") {
    record.response = createBlob(
      bytes,
      record.mimeType || headersGet(record.responseHeaders, "content-type") || "",
    );
  } else if (record.responseType === "json") {
    try { record.response = JSON.parse(text); } catch { record.response = null; }
  } else {
    record.response = null;
  }
  record.readyState = 4;
  record.sent = false;
  dispatch(xhr, "progress");
  dispatch(xhr, "readystatechange");
  dispatch(xhr, "load");
  dispatch(xhr, "loadend");
}

function dispatch(target, type) {
  const event = new Event(type);
  target.dispatchEvent(event);
  const handler = requireTarget(target).handlers.get(`on${type}`) ?? null;
  if (handler !== null) Reflect.apply(handler, target, [event]);
}

function initializeTarget(target) {
  targetState.set(target, { handlers: new Map() });
}

function requireTarget(value) {
  const record = targetState.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

function requireXHR(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

import {
  Request,
  Response,
  requestArrayBuffer,
  requestBlob,
  requestBytes,
  requestClone,
  requestFormData,
  requestJSON,
  requestProperty,
  requestText,
  requestTextStream,
  responseArrayBuffer,
  responseBlob,
  responseBytes,
  responseClone,
  responseFormData,
  responseJSON,
  responseProperty,
  responseText,
  responseTextStream,
  createReplayResponse,
} from "../api/fetch/request-response-runtime.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineStaticMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../engine/webidl/native-function.js";

export function installRequestResponse() {

    delete Request.prototype.constructor;
    defineGlobalConstructor(Request.name, Request);

    delete Response.prototype.constructor;
    defineGlobalConstructor(Response.name, Response);

  installRequest();
  installResponse();
}

function installRequest() {
  getter(Request, "method", requestProperty);
getter(Request, "url", requestProperty);
getter(Request, "headers", requestProperty);
getter(Request, "destination", requestProperty);
getter(Request, "referrer", requestProperty);
getter(Request, "referrerPolicy", requestProperty);
getter(Request, "mode", requestProperty);
getter(Request, "credentials", requestProperty);
getter(Request, "cache", requestProperty);
getter(Request, "redirect", requestProperty);
getter(Request, "integrity", requestProperty);
getter(Request, "keepalive", requestProperty);
getter(Request, "signal", requestProperty);
getter(Request, "duplex", requestProperty);
getter(Request, "isHistoryNavigation", requestProperty);
getter(Request, "bodyUsed", requestProperty);
  method(Request, "arrayBuffer", 0, requestArrayBuffer);
  method(Request, "blob", 0, requestBlob);
  method(Request, "clone", 0, requestClone);
  method(Request, "formData", 0, requestFormData);
  method(Request, "json", 0, requestJSON);
  method(Request, "text", 0, requestText);
  method(Request, "textStream", 0, requestTextStream);
  getter(Request, "targetAddressSpace", requestProperty);
  getter(Request, "isReloadNavigation", requestProperty);
  getter(Request, "body", requestProperty);
  method(Request, "bytes", 0, requestBytes);
  finish(Request);
}

function installResponse() {
  getter(Response, "type", responseProperty);
getter(Response, "url", responseProperty);
getter(Response, "redirected", responseProperty);
getter(Response, "status", responseProperty);
getter(Response, "ok", responseProperty);
getter(Response, "statusText", responseProperty);
getter(Response, "headers", responseProperty);
getter(Response, "body", responseProperty);
getter(Response, "bodyUsed", responseProperty);
  method(Response, "arrayBuffer", 0, responseArrayBuffer);
  method(Response, "blob", 0, responseBlob);
  method(Response, "clone", 0, responseClone);
  method(Response, "formData", 0, responseFormData);
  method(Response, "json", 0, responseJSON);
  method(Response, "text", 0, responseText);
  method(Response, "textStream", 0, responseTextStream);
  method(Response, "bytes", 0, responseBytes);
  finish(Response);
  defineStaticMethod(Response, "error", function () {
    return createReplayResponse(null, {}, {
      type: "error",
      status: 0,
      statusText: "",
    });
  }, 0);
  defineStaticMethod(Response, "json", function (data, init = {}) {
    const headers = new Headers(init.headers);
    if (!headers.has("content-type")) {
      headers.set("content-type", "application/json");
    }
    return new Response(JSON.stringify(data), { ...init, headers });
  }, 1);
  defineStaticMethod(Response, "redirect", function (url, status = 302) {
    if (![301, 302, 303, 307, 308].includes(Number(status))) {
      throw new RangeError("Invalid redirect status");
    }
    return new Response(null, {
      status: Number(status),
      headers: { location: new URL(`${url}`, globalThis.location.href).href },
    });
  }, 1);
}

function getter(constructor, name, operation) {
  const callback = function () {
    return operation(this, name);
  };
  registerNativeGetter(callback, name);
  definePrototypeGetter(constructor.prototype, name, callback);
}

function method(constructor, name, length, operation) {
  const callback = {
    [name](...args) {
      return operation(this, ...args);
    },
  }[name];
  Object.defineProperty(callback, "length", { value: length, configurable: true });
  registerNativeFunction(callback, name);
  definePrototypeMethod(constructor.prototype, name, callback);
}

function finish(constructor) {
  defineConstructorBacklink(constructor.prototype, constructor);
  defineToStringTag(constructor.prototype, constructor.name);
}

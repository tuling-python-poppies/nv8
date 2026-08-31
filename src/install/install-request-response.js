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
} from "../webidl/descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../webidl/native-function.js";

export function installRequestResponse() {
  do {
    delete ((([Request, Response])[0])).prototype.constructor;
    defineGlobalConstructor(((([Request, Response])[0])).name, ((([Request, Response])[0])));
  } while (false);
do {
    delete ((([Request, Response])[1])).prototype.constructor;
    defineGlobalConstructor(((([Request, Response])[1])).name, ((([Request, Response])[1])));
  } while (false);
  installRequest();
  installResponse();
}

function installRequest() {
  do {getter(Request, ("method"), requestProperty);} while (false);
do {getter(Request, ("url"), requestProperty);} while (false);
do {getter(Request, ("headers"), requestProperty);} while (false);
do {getter(Request, ("destination"), requestProperty);} while (false);
do {getter(Request, ("referrer"), requestProperty);} while (false);
do {getter(Request, ("referrerPolicy"), requestProperty);} while (false);
do {getter(Request, ("mode"), requestProperty);} while (false);
do {getter(Request, ("credentials"), requestProperty);} while (false);
do {getter(Request, ("cache"), requestProperty);} while (false);
do {getter(Request, ("redirect"), requestProperty);} while (false);
do {getter(Request, ("integrity"), requestProperty);} while (false);
do {getter(Request, ("keepalive"), requestProperty);} while (false);
do {getter(Request, ("signal"), requestProperty);} while (false);
do {getter(Request, ("duplex"), requestProperty);} while (false);
do {getter(Request, ("isHistoryNavigation"), requestProperty);} while (false);
do {getter(Request, ("bodyUsed"), requestProperty);} while (false);
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
  do {getter(Response, ("type"), responseProperty);} while (false);
do {getter(Response, ("url"), responseProperty);} while (false);
do {getter(Response, ("redirected"), responseProperty);} while (false);
do {getter(Response, ("status"), responseProperty);} while (false);
do {getter(Response, ("ok"), responseProperty);} while (false);
do {getter(Response, ("statusText"), responseProperty);} while (false);
do {getter(Response, ("headers"), responseProperty);} while (false);
do {getter(Response, ("body"), responseProperty);} while (false);
do {getter(Response, ("bodyUsed"), responseProperty);} while (false);
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

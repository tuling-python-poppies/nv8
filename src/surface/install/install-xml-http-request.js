import { EventTarget } from "../api/event/event-target-constructor.js";
import {
  XMLHttpRequest,
  XMLHttpRequestEventTarget,
  XMLHttpRequestUpload,
  setXHRProperty,
  setXHRTargetHandler,
  xhrAbort,
  xhrGetAllResponseHeaders,
  xhrGetResponseHeader,
  xhrOpen,
  xhrOverrideMimeType,
  xhrProperty,
  xhrSend,
  xhrSetAttributionReporting,
  xhrSetPrivateToken,
  xhrSetRequestHeader,
  xhrTargetHandler,
} from "../api/fetch/xml-http-request-runtime.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../engine/webidl/native-function.js";

export function installXMLHttpRequest() {
  installConstructors();
  installTarget();
  finish(XMLHttpRequestUpload);
  installRequest();
}

function installConstructors() {
  Object.setPrototypeOf(XMLHttpRequestEventTarget.prototype, EventTarget.prototype);
  Object.setPrototypeOf(XMLHttpRequestEventTarget, EventTarget);
  Object.setPrototypeOf(
    XMLHttpRequestUpload.prototype,
    XMLHttpRequestEventTarget.prototype,
  );
  Object.setPrototypeOf(XMLHttpRequestUpload, XMLHttpRequestEventTarget);
  Object.setPrototypeOf(
    XMLHttpRequest.prototype,
    XMLHttpRequestEventTarget.prototype,
  );
  Object.setPrototypeOf(XMLHttpRequest, XMLHttpRequestEventTarget);

    delete XMLHttpRequestEventTarget.prototype.constructor;
    defineGlobalConstructor(XMLHttpRequestEventTarget.name, XMLHttpRequestEventTarget);

    delete XMLHttpRequestUpload.prototype.constructor;
    defineGlobalConstructor(XMLHttpRequestUpload.name, XMLHttpRequestUpload);

    delete XMLHttpRequest.prototype.constructor;
    defineGlobalConstructor(XMLHttpRequest.name, XMLHttpRequest);

}

function installTarget() {
  {
    const getter = function () {
      return xhrTargetHandler(this, "onloadstart");
    };
    registerNativeGetter(getter, "onloadstart");
    definePrototypeAccessor(
      XMLHttpRequestEventTarget.prototype,
      ("onloadstart"),
      getter,
      function (value) { setXHRTargetHandler(this, "onloadstart", value); },
    );
  }
{
    const getter = function () {
      return xhrTargetHandler(this, "onprogress");
    };
    registerNativeGetter(getter, "onprogress");
    definePrototypeAccessor(
      XMLHttpRequestEventTarget.prototype,
      ("onprogress"),
      getter,
      function (value) { setXHRTargetHandler(this, "onprogress", value); },
    );
  }
{
    const getter = function () {
      return xhrTargetHandler(this, "onabort");
    };
    registerNativeGetter(getter, "onabort");
    definePrototypeAccessor(
      XMLHttpRequestEventTarget.prototype,
      ("onabort"),
      getter,
      function (value) { setXHRTargetHandler(this, "onabort", value); },
    );
  }
{
    const getter = function () {
      return xhrTargetHandler(this, "onerror");
    };
    registerNativeGetter(getter, "onerror");
    definePrototypeAccessor(
      XMLHttpRequestEventTarget.prototype,
      ("onerror"),
      getter,
      function (value) { setXHRTargetHandler(this, "onerror", value); },
    );
  }
{
    const getter = function () {
      return xhrTargetHandler(this, "onload");
    };
    registerNativeGetter(getter, "onload");
    definePrototypeAccessor(
      XMLHttpRequestEventTarget.prototype,
      ("onload"),
      getter,
      function (value) { setXHRTargetHandler(this, "onload", value); },
    );
  }
{
    const getter = function () {
      return xhrTargetHandler(this, "ontimeout");
    };
    registerNativeGetter(getter, "ontimeout");
    definePrototypeAccessor(
      XMLHttpRequestEventTarget.prototype,
      ("ontimeout"),
      getter,
      function (value) { setXHRTargetHandler(this, "ontimeout", value); },
    );
  }
{
    const getter = function () {
      return xhrTargetHandler(this, "onloadend");
    };
    registerNativeGetter(getter, "onloadend");
    definePrototypeAccessor(
      XMLHttpRequestEventTarget.prototype,
      ("onloadend"),
      getter,
      function (value) { setXHRTargetHandler(this, "onloadend", value); },
    );
  }
  finish(XMLHttpRequestEventTarget);
}

function installRequest() {
  accessor("onreadystatechange");
  getter("readyState");
  accessor("timeout");
  accessor("withCredentials");
  getter("upload");
  getter("responseURL");
  getter("status");
  getter("statusText");
  accessor("responseType");
  getter("response");
  getter("responseText");
  constant("UNSENT", 0);
constant("OPENED", 1);
constant("HEADERS_RECEIVED", 2);
constant("LOADING", 3);
constant("DONE", 4);
  method("abort", 0, xhrAbort);
  method("getAllResponseHeaders", 0, xhrGetAllResponseHeaders);
  method("getResponseHeader", 1, xhrGetResponseHeader);
  method("open", 2, xhrOpen);
  method("overrideMimeType", 1, xhrOverrideMimeType);
  method("send", 0, xhrSend);
  method("setRequestHeader", 2, xhrSetRequestHeader);
  defineConstructorBacklink(XMLHttpRequest.prototype, XMLHttpRequest);
  getter("responseXML");
  method("setAttributionReporting", 1, xhrSetAttributionReporting);
  method("setPrivateToken", 1, xhrSetPrivateToken);
  defineToStringTag(XMLHttpRequest.prototype, "XMLHttpRequest");
}

function getter(name) {
  const callback = function () {
    return xhrProperty(this, name);
  };
  registerNativeGetter(callback, name);
  definePrototypeGetter(XMLHttpRequest.prototype, name, callback);
}

function accessor(name) {
  const callback = function () {
    return name === "onreadystatechange"
      ? xhrTargetHandler(this, name)
      : xhrProperty(this, name);
  };
  registerNativeGetter(callback, name);
  definePrototypeAccessor(XMLHttpRequest.prototype, name, callback, function (value) {
    if (name === "onreadystatechange") setXHRTargetHandler(this, name, value);
    else setXHRProperty(this, name, value);
  });
}

function method(name, length, operation) {
  const callback = {
    [name](...args) { return operation(this, ...args); },
  }[name];
  Object.defineProperty(callback, "length", { value: length, configurable: true });
  registerNativeFunction(callback, name);
  definePrototypeMethod(XMLHttpRequest.prototype, name, callback);
}

function constant(name, value) {

    Object.defineProperty(XMLHttpRequest.prototype, name, {
      value,
      writable: false,
      enumerable: true,
      configurable: false,
    });

    Object.defineProperty(XMLHttpRequest, name, {
      value,
      writable: false,
      enumerable: true,
      configurable: false,
    });

}

function finish(constructor) {
  defineConstructorBacklink(constructor.prototype, constructor);
  defineToStringTag(constructor.prototype, constructor.name);
}

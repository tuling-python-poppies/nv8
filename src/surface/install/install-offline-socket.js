import { DOMException } from "../api/event/dom-exception-constructor.js";
import { EventTarget } from "../api/event/event-target-constructor.js";
import * as runtime from "../api/offline-socket/offline-socket-runtime.js";
import {
  OFFLINE_SOCKET_SURFACES,
} from "../api/offline-socket/offline-socket-surface.js";
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

const constructors = Object.freeze(Object.fromEntries(
  runtime.offlineSocketConstructors.map(Constructor => [
    Constructor.name,
    Constructor,
  ]),
));
const settable = new Set([
  "onopen", "onerror", "onclose", "onmessage", "binaryType",
]);
const constants = Object.freeze({
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
});

export function installOfflineSocket() {

    delete runtime.offlineSocketConstructors[0].prototype.constructor;
    defineGlobalConstructor(runtime.offlineSocketConstructors[0].name, runtime.offlineSocketConstructors[0]);

    delete runtime.offlineSocketConstructors[1].prototype.constructor;
    defineGlobalConstructor(runtime.offlineSocketConstructors[1].name, runtime.offlineSocketConstructors[1]);

    delete runtime.offlineSocketConstructors[2].prototype.constructor;
    defineGlobalConstructor(runtime.offlineSocketConstructors[2].name, runtime.offlineSocketConstructors[2]);

    delete runtime.offlineSocketConstructors[3].prototype.constructor;
    defineGlobalConstructor(runtime.offlineSocketConstructors[3].name, runtime.offlineSocketConstructors[3]);

  {
    const Constructor = constructors["WebSocket"];
    const parent = (((((Object.entries(OFFLINE_SOCKET_SURFACES))[0]))[1])).prototypeParent === "EventTarget"
      ? EventTarget
      : (((((Object.entries(OFFLINE_SOCKET_SURFACES))[0]))[1])).prototypeParent === "DOMException"
        ? DOMException
        : null;
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["EventSource"];
    const parent = (((((Object.entries(OFFLINE_SOCKET_SURFACES))[1]))[1])).prototypeParent === "EventTarget"
      ? EventTarget
      : (((((Object.entries(OFFLINE_SOCKET_SURFACES))[1]))[1])).prototypeParent === "DOMException"
        ? DOMException
        : null;
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["WebSocketError"];
    const parent = (((((Object.entries(OFFLINE_SOCKET_SURFACES))[2]))[1])).prototypeParent === "EventTarget"
      ? EventTarget
      : (((((Object.entries(OFFLINE_SOCKET_SURFACES))[2]))[1])).prototypeParent === "DOMException"
        ? DOMException
        : null;
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["WebSocketStream"];
    const parent = (((((Object.entries(OFFLINE_SOCKET_SURFACES))[3]))[1])).prototypeParent === "EventTarget"
      ? EventTarget
      : (((((Object.entries(OFFLINE_SOCKET_SURFACES))[3]))[1])).prototypeParent === "DOMException"
        ? DOMException
        : null;
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }

    {

    installAccessor(constructors["WebSocket"], "url");

    installAccessor(constructors["WebSocket"], "readyState");

    installAccessor(constructors["WebSocket"], "bufferedAmount");

    installAccessor(constructors["WebSocket"], "onopen");

    installAccessor(constructors["WebSocket"], "onerror");

    installAccessor(constructors["WebSocket"], "onclose");

    installAccessor(constructors["WebSocket"], "extensions");

    installAccessor(constructors["WebSocket"], "protocol");

    installAccessor(constructors["WebSocket"], "onmessage");

    installAccessor(constructors["WebSocket"], "binaryType");

    installConstant(constructors["WebSocket"], "CONNECTING");

    installConstant(constructors["WebSocket"], "OPEN");

    installConstant(constructors["WebSocket"], "CLOSING");

    installConstant(constructors["WebSocket"], "CLOSED");

    installMethod(constructors["WebSocket"], "close", 0);

    installMethod(constructors["WebSocket"], "send", 1);

    {
      defineConstructorBacklink(constructors["WebSocket"].prototype, constructors["WebSocket"]);
    }

    {
      defineToStringTag(constructors["WebSocket"].prototype, constructors["WebSocket"].name);
    }

}

    {

    installAccessor(constructors["EventSource"], "url");

    installAccessor(constructors["EventSource"], "withCredentials");

    installAccessor(constructors["EventSource"], "readyState");

    installAccessor(constructors["EventSource"], "onopen");

    installAccessor(constructors["EventSource"], "onmessage");

    installAccessor(constructors["EventSource"], "onerror");

    installConstant(constructors["EventSource"], "CONNECTING");

    installConstant(constructors["EventSource"], "OPEN");

    installConstant(constructors["EventSource"], "CLOSED");

    installMethod(constructors["EventSource"], "close", 0);

    {
      defineConstructorBacklink(constructors["EventSource"].prototype, constructors["EventSource"]);
    }

    {
      defineToStringTag(constructors["EventSource"].prototype, constructors["EventSource"].name);
    }

}

    {

    installAccessor(constructors["WebSocketError"], "closeCode");

    installAccessor(constructors["WebSocketError"], "reason");

    {
      defineConstructorBacklink(constructors["WebSocketError"].prototype, constructors["WebSocketError"]);
    }

    {
      defineToStringTag(constructors["WebSocketError"].prototype, constructors["WebSocketError"].name);
    }

}

    {

    installAccessor(constructors["WebSocketStream"], "url");

    installAccessor(constructors["WebSocketStream"], "opened");

    installAccessor(constructors["WebSocketStream"], "closed");

    installMethod(constructors["WebSocketStream"], "close", 0);

    {
      defineConstructorBacklink(constructors["WebSocketStream"].prototype, constructors["WebSocketStream"]);
    }

    {
      defineToStringTag(constructors["WebSocketStream"].prototype, constructors["WebSocketStream"].name);
    }

}

}

function installAccessor(Constructor, name) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() {
      return runtime.offlineSocketProperty(this, name);
    },
    set [name](value) {
      runtime.setOfflineSocketProperty(this, name, value);
    },
  }, name);
  registerNativeGetter(descriptor.get, name);
  if (settable.has(name)) {
    registerNativeFunction(descriptor.set, `set ${name}`);
    definePrototypeAccessor(
      Constructor.prototype,
      name,
      descriptor.get,
      descriptor.set,
    );
  } else {
    definePrototypeGetter(Constructor.prototype, name, descriptor.get);
  }
}

function installMethod(Constructor, name, length) {
  const callback = {
    [name](...args) {
      return runtime.offlineSocketOperation(this, name, args);
    },
  }[name];
  Object.defineProperty(callback, "length", {
    value: length,
    configurable: true,
  });
  registerNativeFunction(callback, name);
  definePrototypeMethod(Constructor.prototype, name, callback);
}

function installConstant(Constructor, name) {
  const value = Constructor === runtime.EventSource && name === "CLOSED"
    ? 2
    : constants[name];

    Object.defineProperty(Constructor, name, {
      value,
      writable: false,
      enumerable: true,
      configurable: false,
    });

    Object.defineProperty(Constructor.prototype, name, {
      value,
      writable: false,
      enumerable: true,
      configurable: false,
    });

}

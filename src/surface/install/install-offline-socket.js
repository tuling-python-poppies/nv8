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
  do {
    delete (((runtime.offlineSocketConstructors)[0])).prototype.constructor;
    defineGlobalConstructor((((runtime.offlineSocketConstructors)[0])).name, (((runtime.offlineSocketConstructors)[0])));
  } while (false);
do {
    delete (((runtime.offlineSocketConstructors)[1])).prototype.constructor;
    defineGlobalConstructor((((runtime.offlineSocketConstructors)[1])).name, (((runtime.offlineSocketConstructors)[1])));
  } while (false);
do {
    delete (((runtime.offlineSocketConstructors)[2])).prototype.constructor;
    defineGlobalConstructor((((runtime.offlineSocketConstructors)[2])).name, (((runtime.offlineSocketConstructors)[2])));
  } while (false);
do {
    delete (((runtime.offlineSocketConstructors)[3])).prototype.constructor;
    defineGlobalConstructor((((runtime.offlineSocketConstructors)[3])).name, (((runtime.offlineSocketConstructors)[3])));
  } while (false);
  do {
    const Constructor = constructors[("WebSocket")];
    const parent = (((((Object.entries(OFFLINE_SOCKET_SURFACES))[0]))[1])).prototypeParent === "EventTarget"
      ? EventTarget
      : (((((Object.entries(OFFLINE_SOCKET_SURFACES))[0]))[1])).prototypeParent === "DOMException"
        ? DOMException
        : null;
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("EventSource")];
    const parent = (((((Object.entries(OFFLINE_SOCKET_SURFACES))[1]))[1])).prototypeParent === "EventTarget"
      ? EventTarget
      : (((((Object.entries(OFFLINE_SOCKET_SURFACES))[1]))[1])).prototypeParent === "DOMException"
        ? DOMException
        : null;
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("WebSocketError")];
    const parent = (((((Object.entries(OFFLINE_SOCKET_SURFACES))[2]))[1])).prototypeParent === "EventTarget"
      ? EventTarget
      : (((((Object.entries(OFFLINE_SOCKET_SURFACES))[2]))[1])).prototypeParent === "DOMException"
        ? DOMException
        : null;
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("WebSocketStream")];
    const parent = (((((Object.entries(OFFLINE_SOCKET_SURFACES))[3]))[1])).prototypeParent === "EventTarget"
      ? EventTarget
      : (((((Object.entries(OFFLINE_SOCKET_SURFACES))[3]))[1])).prototypeParent === "DOMException"
        ? DOMException
        : null;
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
  do {
    {
  do {
    installAccessor((constructors[("WebSocket")]), ("url"));
  } while (false);
do {
    installAccessor((constructors[("WebSocket")]), ("readyState"));
  } while (false);
do {
    installAccessor((constructors[("WebSocket")]), ("bufferedAmount"));
  } while (false);
do {
    installAccessor((constructors[("WebSocket")]), ("onopen"));
  } while (false);
do {
    installAccessor((constructors[("WebSocket")]), ("onerror"));
  } while (false);
do {
    installAccessor((constructors[("WebSocket")]), ("onclose"));
  } while (false);
do {
    installAccessor((constructors[("WebSocket")]), ("extensions"));
  } while (false);
do {
    installAccessor((constructors[("WebSocket")]), ("protocol"));
  } while (false);
do {
    installAccessor((constructors[("WebSocket")]), ("onmessage"));
  } while (false);
do {
    installAccessor((constructors[("WebSocket")]), ("binaryType"));
  } while (false);
do {
    installConstant((constructors[("WebSocket")]), ("CONNECTING"));
  } while (false);
do {
    installConstant((constructors[("WebSocket")]), ("OPEN"));
  } while (false);
do {
    installConstant((constructors[("WebSocket")]), ("CLOSING"));
  } while (false);
do {
    installConstant((constructors[("WebSocket")]), ("CLOSED"));
  } while (false);
do {
    installMethod((constructors[("WebSocket")]), ("close"), (0));
  } while (false);
do {
    installMethod((constructors[("WebSocket")]), ("send"), (1));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("WebSocket")]).prototype, (constructors[("WebSocket")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("WebSocket")]).prototype, (constructors[("WebSocket")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("EventSource")]), ("url"));
  } while (false);
do {
    installAccessor((constructors[("EventSource")]), ("withCredentials"));
  } while (false);
do {
    installAccessor((constructors[("EventSource")]), ("readyState"));
  } while (false);
do {
    installAccessor((constructors[("EventSource")]), ("onopen"));
  } while (false);
do {
    installAccessor((constructors[("EventSource")]), ("onmessage"));
  } while (false);
do {
    installAccessor((constructors[("EventSource")]), ("onerror"));
  } while (false);
do {
    installConstant((constructors[("EventSource")]), ("CONNECTING"));
  } while (false);
do {
    installConstant((constructors[("EventSource")]), ("OPEN"));
  } while (false);
do {
    installConstant((constructors[("EventSource")]), ("CLOSED"));
  } while (false);
do {
    installMethod((constructors[("EventSource")]), ("close"), (0));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("EventSource")]).prototype, (constructors[("EventSource")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("EventSource")]).prototype, (constructors[("EventSource")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("WebSocketError")]), ("closeCode"));
  } while (false);
do {
    installAccessor((constructors[("WebSocketError")]), ("reason"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("WebSocketError")]).prototype, (constructors[("WebSocketError")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("WebSocketError")]).prototype, (constructors[("WebSocketError")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("WebSocketStream")]), ("url"));
  } while (false);
do {
    installAccessor((constructors[("WebSocketStream")]), ("opened"));
  } while (false);
do {
    installAccessor((constructors[("WebSocketStream")]), ("closed"));
  } while (false);
do {
    installMethod((constructors[("WebSocketStream")]), ("close"), (0));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("WebSocketStream")]).prototype, (constructors[("WebSocketStream")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("WebSocketStream")]).prototype, (constructors[("WebSocketStream")]).name);
    }
  } while (false);
}
  } while (false);
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
  do {
    Object.defineProperty(((([Constructor, Constructor.prototype])[0])), name, {
      value,
      writable: false,
      enumerable: true,
      configurable: false,
    });
  } while (false);
do {
    Object.defineProperty(((([Constructor, Constructor.prototype])[1])), name, {
      value,
      writable: false,
      enumerable: true,
      configurable: false,
    });
  } while (false);
}

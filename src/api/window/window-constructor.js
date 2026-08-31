import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../webidl/descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../webidl/native-function.js";
import { EventTarget } from "../event/event-target-constructor.js";
import { initializeEventTarget } from "../event/event-target-state.js";
import { WindowProperties } from "./window-properties.js";
import {
  setWindowHandler,
  windowHandler,
  windowPostMessage,
} from "./window-messaging.js";

export function Window() {
  throw new TypeError("Failed to construct 'Window': Illegal constructor");
}

Object.setPrototypeOf(Window, EventTarget);
Object.setPrototypeOf(Window.prototype, WindowProperties);
registerNativeFunction(Window, "Window");

export function installWindowConstructor() {
  delete Window.prototype.constructor;
  Object.defineProperty(Window.prototype, "TEMPORARY", {
    value: 0,
    writable: false,
    enumerable: true,
    configurable: false,
  });
  Object.defineProperty(Window.prototype, "PERSISTENT", {
    value: 1,
    writable: false,
    enumerable: true,
    configurable: false,
  });
  Object.defineProperty(Window, "TEMPORARY", {
    value: 0,
    writable: false,
    enumerable: true,
    configurable: false,
  });
  Object.defineProperty(Window, "PERSISTENT", {
    value: 1,
    writable: false,
    enumerable: true,
    configurable: false,
  });
  defineToStringTag(Window.prototype, "Window");
  defineGlobalConstructor("Window", Window);
  defineConstructorBacklink(Window.prototype, Window);
  const postMessage = {
    postMessage(message) {
      return windowPostMessage(
        globalThis,
        message,
        arguments[1],
        arguments[2],
      );
    },
  }.postMessage;
  Object.defineProperty(postMessage, "length", {
    value: 1,
    configurable: true,
  });
  registerNativeFunction(postMessage, "postMessage");
  Object.defineProperty(globalThis, "postMessage", {
    value: postMessage,
    writable: true,
    enumerable: true,
    configurable: true,
  });
  for (const name of ["onmessage", "onmessageerror"]) {
    const descriptor = Object.getOwnPropertyDescriptor({
      get [name]() {
        return windowHandler(name);
      },
      set [name](value) {
        setWindowHandler(name, value);
      },
    }, name);
    registerNativeGetter(descriptor.get, name);
    registerNativeFunction(descriptor.set, `set ${name}`);
    Object.defineProperty(globalThis, name, {
      get: descriptor.get,
      set: descriptor.set,
      enumerable: true,
      configurable: true,
    });
  }
  Object.setPrototypeOf(globalThis, Window.prototype);
  initializeEventTarget(globalThis);
}

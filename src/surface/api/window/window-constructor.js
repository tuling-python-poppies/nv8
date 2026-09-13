import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineGlobalFunction,
  defineToStringTag,
} from "../../../engine/webidl/descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../../engine/webidl/native-function.js";
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
  // 全局函数统一走 `defineGlobalFunction`：原生 toString、报错文案与
  // descriptor 安装都由它保证，避免这里手写一套 globalThis 定义。
  // postMessage 的最后一个必选参数是 message，length 为 1。
  const postMessage = function postMessage(message) {
    return windowPostMessage(
      globalThis,
      message,
      arguments[1],
      arguments[2],
    );
  };
  defineGlobalFunction("postMessage", postMessage);
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

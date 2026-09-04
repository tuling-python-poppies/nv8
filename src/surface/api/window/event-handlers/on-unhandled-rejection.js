import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../../../engine/webidl/native-function.js";
import {
  traceGetter,
  traceSetter,
} from "../../../../infra/trace/trace-accessor.js";
import {
  getWindowEventHandler,
  setWindowEventHandler,
} from "../window-event-handler-state.js";

const descriptor = Object.getOwnPropertyDescriptor({
  get onunhandledrejection() {
    const value = getWindowEventHandler("onunhandledrejection", globalThis);
    traceGetter("window.onunhandledrejection", "Window", value);
    return value;
  },
  set onunhandledrejection(value) {
    setWindowEventHandler("onunhandledrejection", value, globalThis);
    traceSetter("window.onunhandledrejection", "Window", value);
  },
}, "onunhandledrejection");

export function installOnunhandledrejectionGlobal() {
  registerNativeGetter(descriptor.get, "onunhandledrejection");
  registerNativeFunction(descriptor.set, "set onunhandledrejection");
  Object.defineProperty(globalThis, "onunhandledrejection", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

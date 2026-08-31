import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../../webidl/native-function.js";
import {
  traceGetter,
  traceSetter,
} from "../../../trace/trace-accessor.js";
import {
  getWindowEventHandler,
  setWindowEventHandler,
} from "../window-event-handler-state.js";

const descriptor = Object.getOwnPropertyDescriptor({
  get onabort() {
    const value = getWindowEventHandler("onabort", globalThis);
    traceGetter("window.onabort", "Window", value);
    return value;
  },
  set onabort(value) {
    setWindowEventHandler("onabort", value, globalThis);
    traceSetter("window.onabort", "Window", value);
  },
}, "onabort");

export function installOnabortGlobal() {
  registerNativeGetter(descriptor.get, "onabort");
  registerNativeFunction(descriptor.set, "set onabort");
  Object.defineProperty(globalThis, "onabort", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

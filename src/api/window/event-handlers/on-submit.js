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
  get onsubmit() {
    const value = getWindowEventHandler("onsubmit", globalThis);
    traceGetter("window.onsubmit", "Window", value);
    return value;
  },
  set onsubmit(value) {
    setWindowEventHandler("onsubmit", value, globalThis);
    traceSetter("window.onsubmit", "Window", value);
  },
}, "onsubmit");

export function installOnsubmitGlobal() {
  registerNativeGetter(descriptor.get, "onsubmit");
  registerNativeFunction(descriptor.set, "set onsubmit");
  Object.defineProperty(globalThis, "onsubmit", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

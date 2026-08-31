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
  get onscrollend() {
    const value = getWindowEventHandler("onscrollend", globalThis);
    traceGetter("window.onscrollend", "Window", value);
    return value;
  },
  set onscrollend(value) {
    setWindowEventHandler("onscrollend", value, globalThis);
    traceSetter("window.onscrollend", "Window", value);
  },
}, "onscrollend");

export function installOnscrollendGlobal() {
  registerNativeGetter(descriptor.get, "onscrollend");
  registerNativeFunction(descriptor.set, "set onscrollend");
  Object.defineProperty(globalThis, "onscrollend", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

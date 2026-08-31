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
  get onloadstart() {
    const value = getWindowEventHandler("onloadstart", globalThis);
    traceGetter("window.onloadstart", "Window", value);
    return value;
  },
  set onloadstart(value) {
    setWindowEventHandler("onloadstart", value, globalThis);
    traceSetter("window.onloadstart", "Window", value);
  },
}, "onloadstart");

export function installOnloadstartGlobal() {
  registerNativeGetter(descriptor.get, "onloadstart");
  registerNativeFunction(descriptor.set, "set onloadstart");
  Object.defineProperty(globalThis, "onloadstart", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

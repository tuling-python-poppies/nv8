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
  get onload() {
    const value = getWindowEventHandler("onload", globalThis);
    traceGetter("window.onload", "Window", value);
    return value;
  },
  set onload(value) {
    setWindowEventHandler("onload", value, globalThis);
    traceSetter("window.onload", "Window", value);
  },
}, "onload");

export function installOnloadGlobal() {
  registerNativeGetter(descriptor.get, "onload");
  registerNativeFunction(descriptor.set, "set onload");
  Object.defineProperty(globalThis, "onload", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

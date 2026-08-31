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
  get onfocus() {
    const value = getWindowEventHandler("onfocus", globalThis);
    traceGetter("window.onfocus", "Window", value);
    return value;
  },
  set onfocus(value) {
    setWindowEventHandler("onfocus", value, globalThis);
    traceSetter("window.onfocus", "Window", value);
  },
}, "onfocus");

export function installOnfocusGlobal() {
  registerNativeGetter(descriptor.get, "onfocus");
  registerNativeFunction(descriptor.set, "set onfocus");
  Object.defineProperty(globalThis, "onfocus", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

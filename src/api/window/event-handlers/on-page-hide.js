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
  get onpagehide() {
    const value = getWindowEventHandler("onpagehide", globalThis);
    traceGetter("window.onpagehide", "Window", value);
    return value;
  },
  set onpagehide(value) {
    setWindowEventHandler("onpagehide", value, globalThis);
    traceSetter("window.onpagehide", "Window", value);
  },
}, "onpagehide");

export function installOnpagehideGlobal() {
  registerNativeGetter(descriptor.get, "onpagehide");
  registerNativeFunction(descriptor.set, "set onpagehide");
  Object.defineProperty(globalThis, "onpagehide", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

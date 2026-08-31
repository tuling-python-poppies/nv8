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
  get onunload() {
    const value = getWindowEventHandler("onunload", globalThis);
    traceGetter("window.onunload", "Window", value);
    return value;
  },
  set onunload(value) {
    setWindowEventHandler("onunload", value, globalThis);
    traceSetter("window.onunload", "Window", value);
  },
}, "onunload");

export function installOnunloadGlobal() {
  registerNativeGetter(descriptor.get, "onunload");
  registerNativeFunction(descriptor.set, "set onunload");
  Object.defineProperty(globalThis, "onunload", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

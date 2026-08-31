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
  get oncancel() {
    const value = getWindowEventHandler("oncancel", globalThis);
    traceGetter("window.oncancel", "Window", value);
    return value;
  },
  set oncancel(value) {
    setWindowEventHandler("oncancel", value, globalThis);
    traceSetter("window.oncancel", "Window", value);
  },
}, "oncancel");

export function installOncancelGlobal() {
  registerNativeGetter(descriptor.get, "oncancel");
  registerNativeFunction(descriptor.set, "set oncancel");
  Object.defineProperty(globalThis, "oncancel", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

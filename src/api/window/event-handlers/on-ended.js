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
  get onended() {
    const value = getWindowEventHandler("onended", globalThis);
    traceGetter("window.onended", "Window", value);
    return value;
  },
  set onended(value) {
    setWindowEventHandler("onended", value, globalThis);
    traceSetter("window.onended", "Window", value);
  },
}, "onended");

export function installOnendedGlobal() {
  registerNativeGetter(descriptor.get, "onended");
  registerNativeFunction(descriptor.set, "set onended");
  Object.defineProperty(globalThis, "onended", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

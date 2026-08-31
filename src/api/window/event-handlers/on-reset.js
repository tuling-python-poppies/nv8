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
  get onreset() {
    const value = getWindowEventHandler("onreset", globalThis);
    traceGetter("window.onreset", "Window", value);
    return value;
  },
  set onreset(value) {
    setWindowEventHandler("onreset", value, globalThis);
    traceSetter("window.onreset", "Window", value);
  },
}, "onreset");

export function installOnresetGlobal() {
  registerNativeGetter(descriptor.get, "onreset");
  registerNativeFunction(descriptor.set, "set onreset");
  Object.defineProperty(globalThis, "onreset", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

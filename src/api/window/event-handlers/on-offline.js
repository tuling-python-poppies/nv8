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
  get onoffline() {
    const value = getWindowEventHandler("onoffline", globalThis);
    traceGetter("window.onoffline", "Window", value);
    return value;
  },
  set onoffline(value) {
    setWindowEventHandler("onoffline", value, globalThis);
    traceSetter("window.onoffline", "Window", value);
  },
}, "onoffline");

export function installOnofflineGlobal() {
  registerNativeGetter(descriptor.get, "onoffline");
  registerNativeFunction(descriptor.set, "set onoffline");
  Object.defineProperty(globalThis, "onoffline", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

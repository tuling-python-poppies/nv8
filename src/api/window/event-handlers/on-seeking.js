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
  get onseeking() {
    const value = getWindowEventHandler("onseeking", globalThis);
    traceGetter("window.onseeking", "Window", value);
    return value;
  },
  set onseeking(value) {
    setWindowEventHandler("onseeking", value, globalThis);
    traceSetter("window.onseeking", "Window", value);
  },
}, "onseeking");

export function installOnseekingGlobal() {
  registerNativeGetter(descriptor.get, "onseeking");
  registerNativeFunction(descriptor.set, "set onseeking");
  Object.defineProperty(globalThis, "onseeking", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

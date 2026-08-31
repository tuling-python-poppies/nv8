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
  get onerror() {
    const value = getWindowEventHandler("onerror", globalThis);
    traceGetter("window.onerror", "Window", value);
    return value;
  },
  set onerror(value) {
    setWindowEventHandler("onerror", value, globalThis);
    traceSetter("window.onerror", "Window", value);
  },
}, "onerror");

export function installOnerrorGlobal() {
  registerNativeGetter(descriptor.get, "onerror");
  registerNativeFunction(descriptor.set, "set onerror");
  Object.defineProperty(globalThis, "onerror", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

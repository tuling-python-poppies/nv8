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
  get onstorage() {
    const value = getWindowEventHandler("onstorage", globalThis);
    traceGetter("window.onstorage", "Window", value);
    return value;
  },
  set onstorage(value) {
    setWindowEventHandler("onstorage", value, globalThis);
    traceSetter("window.onstorage", "Window", value);
  },
}, "onstorage");

export function installOnstorageGlobal() {
  registerNativeGetter(descriptor.get, "onstorage");
  registerNativeFunction(descriptor.set, "set onstorage");
  Object.defineProperty(globalThis, "onstorage", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

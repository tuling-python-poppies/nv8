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
  get onselectstart() {
    const value = getWindowEventHandler("onselectstart", globalThis);
    traceGetter("window.onselectstart", "Window", value);
    return value;
  },
  set onselectstart(value) {
    setWindowEventHandler("onselectstart", value, globalThis);
    traceSetter("window.onselectstart", "Window", value);
  },
}, "onselectstart");

export function installOnselectstartGlobal() {
  registerNativeGetter(descriptor.get, "onselectstart");
  registerNativeFunction(descriptor.set, "set onselectstart");
  Object.defineProperty(globalThis, "onselectstart", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

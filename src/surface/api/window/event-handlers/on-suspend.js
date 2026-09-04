import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../../../engine/webidl/native-function.js";
import {
  traceGetter,
  traceSetter,
} from "../../../../infra/trace/trace-accessor.js";
import {
  getWindowEventHandler,
  setWindowEventHandler,
} from "../window-event-handler-state.js";

const descriptor = Object.getOwnPropertyDescriptor({
  get onsuspend() {
    const value = getWindowEventHandler("onsuspend", globalThis);
    traceGetter("window.onsuspend", "Window", value);
    return value;
  },
  set onsuspend(value) {
    setWindowEventHandler("onsuspend", value, globalThis);
    traceSetter("window.onsuspend", "Window", value);
  },
}, "onsuspend");

export function installOnsuspendGlobal() {
  registerNativeGetter(descriptor.get, "onsuspend");
  registerNativeFunction(descriptor.set, "set onsuspend");
  Object.defineProperty(globalThis, "onsuspend", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

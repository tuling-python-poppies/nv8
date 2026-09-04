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
  get onsearch() {
    const value = getWindowEventHandler("onsearch", globalThis);
    traceGetter("window.onsearch", "Window", value);
    return value;
  },
  set onsearch(value) {
    setWindowEventHandler("onsearch", value, globalThis);
    traceSetter("window.onsearch", "Window", value);
  },
}, "onsearch");

export function installOnsearchGlobal() {
  registerNativeGetter(descriptor.get, "onsearch");
  registerNativeFunction(descriptor.set, "set onsearch");
  Object.defineProperty(globalThis, "onsearch", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

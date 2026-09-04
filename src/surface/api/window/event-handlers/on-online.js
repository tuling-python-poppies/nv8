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
  get ononline() {
    const value = getWindowEventHandler("ononline", globalThis);
    traceGetter("window.ononline", "Window", value);
    return value;
  },
  set ononline(value) {
    setWindowEventHandler("ononline", value, globalThis);
    traceSetter("window.ononline", "Window", value);
  },
}, "ononline");

export function installOnonlineGlobal() {
  registerNativeGetter(descriptor.get, "ononline");
  registerNativeFunction(descriptor.set, "set ononline");
  Object.defineProperty(globalThis, "ononline", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

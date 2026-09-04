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
  get onseeked() {
    const value = getWindowEventHandler("onseeked", globalThis);
    traceGetter("window.onseeked", "Window", value);
    return value;
  },
  set onseeked(value) {
    setWindowEventHandler("onseeked", value, globalThis);
    traceSetter("window.onseeked", "Window", value);
  },
}, "onseeked");

export function installOnseekedGlobal() {
  registerNativeGetter(descriptor.get, "onseeked");
  registerNativeFunction(descriptor.set, "set onseeked");
  Object.defineProperty(globalThis, "onseeked", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

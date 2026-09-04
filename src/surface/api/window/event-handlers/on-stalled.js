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
  get onstalled() {
    const value = getWindowEventHandler("onstalled", globalThis);
    traceGetter("window.onstalled", "Window", value);
    return value;
  },
  set onstalled(value) {
    setWindowEventHandler("onstalled", value, globalThis);
    traceSetter("window.onstalled", "Window", value);
  },
}, "onstalled");

export function installOnstalledGlobal() {
  registerNativeGetter(descriptor.get, "onstalled");
  registerNativeFunction(descriptor.set, "set onstalled");
  Object.defineProperty(globalThis, "onstalled", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

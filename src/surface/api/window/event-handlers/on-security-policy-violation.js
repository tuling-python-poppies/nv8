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
  get onsecuritypolicyviolation() {
    const value = getWindowEventHandler("onsecuritypolicyviolation", globalThis);
    traceGetter("window.onsecuritypolicyviolation", "Window", value);
    return value;
  },
  set onsecuritypolicyviolation(value) {
    setWindowEventHandler("onsecuritypolicyviolation", value, globalThis);
    traceSetter("window.onsecuritypolicyviolation", "Window", value);
  },
}, "onsecuritypolicyviolation");

export function installOnsecuritypolicyviolationGlobal() {
  registerNativeGetter(descriptor.get, "onsecuritypolicyviolation");
  registerNativeFunction(descriptor.set, "set onsecuritypolicyviolation");
  Object.defineProperty(globalThis, "onsecuritypolicyviolation", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

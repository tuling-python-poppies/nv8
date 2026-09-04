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
  get onemptied() {
    const value = getWindowEventHandler("onemptied", globalThis);
    traceGetter("window.onemptied", "Window", value);
    return value;
  },
  set onemptied(value) {
    setWindowEventHandler("onemptied", value, globalThis);
    traceSetter("window.onemptied", "Window", value);
  },
}, "onemptied");

export function installOnemptiedGlobal() {
  registerNativeGetter(descriptor.get, "onemptied");
  registerNativeFunction(descriptor.set, "set onemptied");
  Object.defineProperty(globalThis, "onemptied", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

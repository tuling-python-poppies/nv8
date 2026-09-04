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
  get onlanguagechange() {
    const value = getWindowEventHandler("onlanguagechange", globalThis);
    traceGetter("window.onlanguagechange", "Window", value);
    return value;
  },
  set onlanguagechange(value) {
    setWindowEventHandler("onlanguagechange", value, globalThis);
    traceSetter("window.onlanguagechange", "Window", value);
  },
}, "onlanguagechange");

export function installOnlanguagechangeGlobal() {
  registerNativeGetter(descriptor.get, "onlanguagechange");
  registerNativeFunction(descriptor.set, "set onlanguagechange");
  Object.defineProperty(globalThis, "onlanguagechange", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

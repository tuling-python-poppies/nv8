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
  get onappinstalled() {
    const value = getWindowEventHandler("onappinstalled", globalThis);
    traceGetter("window.onappinstalled", "Window", value);
    return value;
  },
  set onappinstalled(value) {
    setWindowEventHandler("onappinstalled", value, globalThis);
    traceSetter("window.onappinstalled", "Window", value);
  },
}, "onappinstalled");

export function installOnappinstalledGlobal() {
  registerNativeGetter(descriptor.get, "onappinstalled");
  registerNativeFunction(descriptor.set, "set onappinstalled");
  Object.defineProperty(globalThis, "onappinstalled", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

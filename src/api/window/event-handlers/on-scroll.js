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
  get onscroll() {
    const value = getWindowEventHandler("onscroll", globalThis);
    traceGetter("window.onscroll", "Window", value);
    return value;
  },
  set onscroll(value) {
    setWindowEventHandler("onscroll", value, globalThis);
    traceSetter("window.onscroll", "Window", value);
  },
}, "onscroll");

export function installOnscrollGlobal() {
  registerNativeGetter(descriptor.get, "onscroll");
  registerNativeFunction(descriptor.set, "set onscroll");
  Object.defineProperty(globalThis, "onscroll", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

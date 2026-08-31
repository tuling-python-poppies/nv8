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
  get onmouseleave() {
    const value = getWindowEventHandler("onmouseleave", globalThis);
    traceGetter("window.onmouseleave", "Window", value);
    return value;
  },
  set onmouseleave(value) {
    setWindowEventHandler("onmouseleave", value, globalThis);
    traceSetter("window.onmouseleave", "Window", value);
  },
}, "onmouseleave");

export function installOnmouseleaveGlobal() {
  registerNativeGetter(descriptor.get, "onmouseleave");
  registerNativeFunction(descriptor.set, "set onmouseleave");
  Object.defineProperty(globalThis, "onmouseleave", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

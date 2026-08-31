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
  get onmouseenter() {
    const value = getWindowEventHandler("onmouseenter", globalThis);
    traceGetter("window.onmouseenter", "Window", value);
    return value;
  },
  set onmouseenter(value) {
    setWindowEventHandler("onmouseenter", value, globalThis);
    traceSetter("window.onmouseenter", "Window", value);
  },
}, "onmouseenter");

export function installOnmouseenterGlobal() {
  registerNativeGetter(descriptor.get, "onmouseenter");
  registerNativeFunction(descriptor.set, "set onmouseenter");
  Object.defineProperty(globalThis, "onmouseenter", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

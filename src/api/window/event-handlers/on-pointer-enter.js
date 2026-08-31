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
  get onpointerenter() {
    const value = getWindowEventHandler("onpointerenter", globalThis);
    traceGetter("window.onpointerenter", "Window", value);
    return value;
  },
  set onpointerenter(value) {
    setWindowEventHandler("onpointerenter", value, globalThis);
    traceSetter("window.onpointerenter", "Window", value);
  },
}, "onpointerenter");

export function installOnpointerenterGlobal() {
  registerNativeGetter(descriptor.get, "onpointerenter");
  registerNativeFunction(descriptor.set, "set onpointerenter");
  Object.defineProperty(globalThis, "onpointerenter", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

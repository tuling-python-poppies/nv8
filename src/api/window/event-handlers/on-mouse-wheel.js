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
  get onmousewheel() {
    const value = getWindowEventHandler("onmousewheel", globalThis);
    traceGetter("window.onmousewheel", "Window", value);
    return value;
  },
  set onmousewheel(value) {
    setWindowEventHandler("onmousewheel", value, globalThis);
    traceSetter("window.onmousewheel", "Window", value);
  },
}, "onmousewheel");

export function installOnmousewheelGlobal() {
  registerNativeGetter(descriptor.get, "onmousewheel");
  registerNativeFunction(descriptor.set, "set onmousewheel");
  Object.defineProperty(globalThis, "onmousewheel", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

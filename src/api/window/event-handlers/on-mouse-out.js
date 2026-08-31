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
  get onmouseout() {
    const value = getWindowEventHandler("onmouseout", globalThis);
    traceGetter("window.onmouseout", "Window", value);
    return value;
  },
  set onmouseout(value) {
    setWindowEventHandler("onmouseout", value, globalThis);
    traceSetter("window.onmouseout", "Window", value);
  },
}, "onmouseout");

export function installOnmouseoutGlobal() {
  registerNativeGetter(descriptor.get, "onmouseout");
  registerNativeFunction(descriptor.set, "set onmouseout");
  Object.defineProperty(globalThis, "onmouseout", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

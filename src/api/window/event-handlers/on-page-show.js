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
  get onpageshow() {
    const value = getWindowEventHandler("onpageshow", globalThis);
    traceGetter("window.onpageshow", "Window", value);
    return value;
  },
  set onpageshow(value) {
    setWindowEventHandler("onpageshow", value, globalThis);
    traceSetter("window.onpageshow", "Window", value);
  },
}, "onpageshow");

export function installOnpageshowGlobal() {
  registerNativeGetter(descriptor.get, "onpageshow");
  registerNativeFunction(descriptor.set, "set onpageshow");
  Object.defineProperty(globalThis, "onpageshow", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

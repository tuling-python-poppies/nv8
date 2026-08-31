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
  get onpagereveal() {
    const value = getWindowEventHandler("onpagereveal", globalThis);
    traceGetter("window.onpagereveal", "Window", value);
    return value;
  },
  set onpagereveal(value) {
    setWindowEventHandler("onpagereveal", value, globalThis);
    traceSetter("window.onpagereveal", "Window", value);
  },
}, "onpagereveal");

export function installOnpagerevealGlobal() {
  registerNativeGetter(descriptor.get, "onpagereveal");
  registerNativeFunction(descriptor.set, "set onpagereveal");
  Object.defineProperty(globalThis, "onpagereveal", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

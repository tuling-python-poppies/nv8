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
  get onpageswap() {
    const value = getWindowEventHandler("onpageswap", globalThis);
    traceGetter("window.onpageswap", "Window", value);
    return value;
  },
  set onpageswap(value) {
    setWindowEventHandler("onpageswap", value, globalThis);
    traceSetter("window.onpageswap", "Window", value);
  },
}, "onpageswap");

export function installOnpageswapGlobal() {
  registerNativeGetter(descriptor.get, "onpageswap");
  registerNativeFunction(descriptor.set, "set onpageswap");
  Object.defineProperty(globalThis, "onpageswap", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

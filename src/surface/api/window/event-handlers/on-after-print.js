import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../../../engine/webidl/native-function.js";
import {
  traceGetter,
  traceSetter,
} from "../../../../infra/trace/trace-accessor.js";
import {
  getWindowEventHandler,
  setWindowEventHandler,
} from "../window-event-handler-state.js";

const descriptor = Object.getOwnPropertyDescriptor({
  get onafterprint() {
    const value = getWindowEventHandler("onafterprint", globalThis);
    traceGetter("window.onafterprint", "Window", value);
    return value;
  },
  set onafterprint(value) {
    setWindowEventHandler("onafterprint", value, globalThis);
    traceSetter("window.onafterprint", "Window", value);
  },
}, "onafterprint");

export function installOnafterprintGlobal() {
  registerNativeGetter(descriptor.get, "onafterprint");
  registerNativeFunction(descriptor.set, "set onafterprint");
  Object.defineProperty(globalThis, "onafterprint", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

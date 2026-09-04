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
  get onloadeddata() {
    const value = getWindowEventHandler("onloadeddata", globalThis);
    traceGetter("window.onloadeddata", "Window", value);
    return value;
  },
  set onloadeddata(value) {
    setWindowEventHandler("onloadeddata", value, globalThis);
    traceSetter("window.onloadeddata", "Window", value);
  },
}, "onloadeddata");

export function installOnloadeddataGlobal() {
  registerNativeGetter(descriptor.get, "onloadeddata");
  registerNativeFunction(descriptor.set, "set onloadeddata");
  Object.defineProperty(globalThis, "onloadeddata", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

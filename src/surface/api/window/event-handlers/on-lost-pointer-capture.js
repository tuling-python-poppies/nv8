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
  get onlostpointercapture() {
    const value = getWindowEventHandler("onlostpointercapture", globalThis);
    traceGetter("window.onlostpointercapture", "Window", value);
    return value;
  },
  set onlostpointercapture(value) {
    setWindowEventHandler("onlostpointercapture", value, globalThis);
    traceSetter("window.onlostpointercapture", "Window", value);
  },
}, "onlostpointercapture");

export function installOnlostpointercaptureGlobal() {
  registerNativeGetter(descriptor.get, "onlostpointercapture");
  registerNativeFunction(descriptor.set, "set onlostpointercapture");
  Object.defineProperty(globalThis, "onlostpointercapture", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

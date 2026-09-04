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
  get ongotpointercapture() {
    const value = getWindowEventHandler("ongotpointercapture", globalThis);
    traceGetter("window.ongotpointercapture", "Window", value);
    return value;
  },
  set ongotpointercapture(value) {
    setWindowEventHandler("ongotpointercapture", value, globalThis);
    traceSetter("window.ongotpointercapture", "Window", value);
  },
}, "ongotpointercapture");

export function installOngotpointercaptureGlobal() {
  registerNativeGetter(descriptor.get, "ongotpointercapture");
  registerNativeFunction(descriptor.set, "set ongotpointercapture");
  Object.defineProperty(globalThis, "ongotpointercapture", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

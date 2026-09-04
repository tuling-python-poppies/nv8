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
  get ondeviceorientationabsolute() {
    const value = getWindowEventHandler("ondeviceorientationabsolute", globalThis);
    traceGetter("window.ondeviceorientationabsolute", "Window", value);
    return value;
  },
  set ondeviceorientationabsolute(value) {
    setWindowEventHandler("ondeviceorientationabsolute", value, globalThis);
    traceSetter("window.ondeviceorientationabsolute", "Window", value);
  },
}, "ondeviceorientationabsolute");

export function installOndeviceorientationabsoluteGlobal() {
  registerNativeGetter(descriptor.get, "ondeviceorientationabsolute");
  registerNativeFunction(descriptor.set, "set ondeviceorientationabsolute");
  Object.defineProperty(globalThis, "ondeviceorientationabsolute", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

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
  get ondeviceorientation() {
    const value = getWindowEventHandler("ondeviceorientation", globalThis);
    traceGetter("window.ondeviceorientation", "Window", value);
    return value;
  },
  set ondeviceorientation(value) {
    setWindowEventHandler("ondeviceorientation", value, globalThis);
    traceSetter("window.ondeviceorientation", "Window", value);
  },
}, "ondeviceorientation");

export function installOndeviceorientationGlobal() {
  registerNativeGetter(descriptor.get, "ondeviceorientation");
  registerNativeFunction(descriptor.set, "set ondeviceorientation");
  Object.defineProperty(globalThis, "ondeviceorientation", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

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
  get ondevicemotion() {
    const value = getWindowEventHandler("ondevicemotion", globalThis);
    traceGetter("window.ondevicemotion", "Window", value);
    return value;
  },
  set ondevicemotion(value) {
    setWindowEventHandler("ondevicemotion", value, globalThis);
    traceSetter("window.ondevicemotion", "Window", value);
  },
}, "ondevicemotion");

export function installOndevicemotionGlobal() {
  registerNativeGetter(descriptor.get, "ondevicemotion");
  registerNativeFunction(descriptor.set, "set ondevicemotion");
  Object.defineProperty(globalThis, "ondevicemotion", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

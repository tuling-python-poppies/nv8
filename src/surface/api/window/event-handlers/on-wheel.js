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
  get onwheel() {
    const value = getWindowEventHandler("onwheel", globalThis);
    traceGetter("window.onwheel", "Window", value);
    return value;
  },
  set onwheel(value) {
    setWindowEventHandler("onwheel", value, globalThis);
    traceSetter("window.onwheel", "Window", value);
  },
}, "onwheel");

export function installOnwheelGlobal() {
  registerNativeGetter(descriptor.get, "onwheel");
  registerNativeFunction(descriptor.set, "set onwheel");
  Object.defineProperty(globalThis, "onwheel", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

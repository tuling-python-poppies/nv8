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
  get onselect() {
    const value = getWindowEventHandler("onselect", globalThis);
    traceGetter("window.onselect", "Window", value);
    return value;
  },
  set onselect(value) {
    setWindowEventHandler("onselect", value, globalThis);
    traceSetter("window.onselect", "Window", value);
  },
}, "onselect");

export function installOnselectGlobal() {
  registerNativeGetter(descriptor.get, "onselect");
  registerNativeFunction(descriptor.set, "set onselect");
  Object.defineProperty(globalThis, "onselect", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

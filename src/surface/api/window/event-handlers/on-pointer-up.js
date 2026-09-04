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
  get onpointerup() {
    const value = getWindowEventHandler("onpointerup", globalThis);
    traceGetter("window.onpointerup", "Window", value);
    return value;
  },
  set onpointerup(value) {
    setWindowEventHandler("onpointerup", value, globalThis);
    traceSetter("window.onpointerup", "Window", value);
  },
}, "onpointerup");

export function installOnpointerupGlobal() {
  registerNativeGetter(descriptor.get, "onpointerup");
  registerNativeFunction(descriptor.set, "set onpointerup");
  Object.defineProperty(globalThis, "onpointerup", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

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
  get onpointerleave() {
    const value = getWindowEventHandler("onpointerleave", globalThis);
    traceGetter("window.onpointerleave", "Window", value);
    return value;
  },
  set onpointerleave(value) {
    setWindowEventHandler("onpointerleave", value, globalThis);
    traceSetter("window.onpointerleave", "Window", value);
  },
}, "onpointerleave");

export function installOnpointerleaveGlobal() {
  registerNativeGetter(descriptor.get, "onpointerleave");
  registerNativeFunction(descriptor.set, "set onpointerleave");
  Object.defineProperty(globalThis, "onpointerleave", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

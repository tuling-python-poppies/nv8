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
  get onscrollsnapchanging() {
    const value = getWindowEventHandler("onscrollsnapchanging", globalThis);
    traceGetter("window.onscrollsnapchanging", "Window", value);
    return value;
  },
  set onscrollsnapchanging(value) {
    setWindowEventHandler("onscrollsnapchanging", value, globalThis);
    traceSetter("window.onscrollsnapchanging", "Window", value);
  },
}, "onscrollsnapchanging");

export function installOnscrollsnapchangingGlobal() {
  registerNativeGetter(descriptor.get, "onscrollsnapchanging");
  registerNativeFunction(descriptor.set, "set onscrollsnapchanging");
  Object.defineProperty(globalThis, "onscrollsnapchanging", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

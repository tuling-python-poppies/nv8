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
  get onscrollsnapchange() {
    const value = getWindowEventHandler("onscrollsnapchange", globalThis);
    traceGetter("window.onscrollsnapchange", "Window", value);
    return value;
  },
  set onscrollsnapchange(value) {
    setWindowEventHandler("onscrollsnapchange", value, globalThis);
    traceSetter("window.onscrollsnapchange", "Window", value);
  },
}, "onscrollsnapchange");

export function installOnscrollsnapchangeGlobal() {
  registerNativeGetter(descriptor.get, "onscrollsnapchange");
  registerNativeFunction(descriptor.set, "set onscrollsnapchange");
  Object.defineProperty(globalThis, "onscrollsnapchange", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

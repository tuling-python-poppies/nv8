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
  get onmousedown() {
    const value = getWindowEventHandler("onmousedown", globalThis);
    traceGetter("window.onmousedown", "Window", value);
    return value;
  },
  set onmousedown(value) {
    setWindowEventHandler("onmousedown", value, globalThis);
    traceSetter("window.onmousedown", "Window", value);
  },
}, "onmousedown");

export function installOnmousedownGlobal() {
  registerNativeGetter(descriptor.get, "onmousedown");
  registerNativeFunction(descriptor.set, "set onmousedown");
  Object.defineProperty(globalThis, "onmousedown", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

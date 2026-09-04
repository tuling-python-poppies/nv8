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
  get onslotchange() {
    const value = getWindowEventHandler("onslotchange", globalThis);
    traceGetter("window.onslotchange", "Window", value);
    return value;
  },
  set onslotchange(value) {
    setWindowEventHandler("onslotchange", value, globalThis);
    traceSetter("window.onslotchange", "Window", value);
  },
}, "onslotchange");

export function installOnslotchangeGlobal() {
  registerNativeGetter(descriptor.get, "onslotchange");
  registerNativeFunction(descriptor.set, "set onslotchange");
  Object.defineProperty(globalThis, "onslotchange", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

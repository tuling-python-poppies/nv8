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
  get onkeypress() {
    const value = getWindowEventHandler("onkeypress", globalThis);
    traceGetter("window.onkeypress", "Window", value);
    return value;
  },
  set onkeypress(value) {
    setWindowEventHandler("onkeypress", value, globalThis);
    traceSetter("window.onkeypress", "Window", value);
  },
}, "onkeypress");

export function installOnkeypressGlobal() {
  registerNativeGetter(descriptor.get, "onkeypress");
  registerNativeFunction(descriptor.set, "set onkeypress");
  Object.defineProperty(globalThis, "onkeypress", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

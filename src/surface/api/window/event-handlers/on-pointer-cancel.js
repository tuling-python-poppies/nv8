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
  get onpointercancel() {
    const value = getWindowEventHandler("onpointercancel", globalThis);
    traceGetter("window.onpointercancel", "Window", value);
    return value;
  },
  set onpointercancel(value) {
    setWindowEventHandler("onpointercancel", value, globalThis);
    traceSetter("window.onpointercancel", "Window", value);
  },
}, "onpointercancel");

export function installOnpointercancelGlobal() {
  registerNativeGetter(descriptor.get, "onpointercancel");
  registerNativeFunction(descriptor.set, "set onpointercancel");
  Object.defineProperty(globalThis, "onpointercancel", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

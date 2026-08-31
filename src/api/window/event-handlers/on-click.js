import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../../webidl/native-function.js";
import {
  traceGetter,
  traceSetter,
} from "../../../trace/trace-accessor.js";
import {
  getWindowEventHandler,
  setWindowEventHandler,
} from "../window-event-handler-state.js";

const descriptor = Object.getOwnPropertyDescriptor({
  get onclick() {
    const value = getWindowEventHandler("onclick", globalThis);
    traceGetter("window.onclick", "Window", value);
    return value;
  },
  set onclick(value) {
    setWindowEventHandler("onclick", value, globalThis);
    traceSetter("window.onclick", "Window", value);
  },
}, "onclick");

export function installOnclickGlobal() {
  registerNativeGetter(descriptor.get, "onclick");
  registerNativeFunction(descriptor.set, "set onclick");
  Object.defineProperty(globalThis, "onclick", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

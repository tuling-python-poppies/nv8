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
  get onchange() {
    const value = getWindowEventHandler("onchange", globalThis);
    traceGetter("window.onchange", "Window", value);
    return value;
  },
  set onchange(value) {
    setWindowEventHandler("onchange", value, globalThis);
    traceSetter("window.onchange", "Window", value);
  },
}, "onchange");

export function installOnchangeGlobal() {
  registerNativeGetter(descriptor.get, "onchange");
  registerNativeFunction(descriptor.set, "set onchange");
  Object.defineProperty(globalThis, "onchange", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

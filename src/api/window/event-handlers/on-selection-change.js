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
  get onselectionchange() {
    const value = getWindowEventHandler("onselectionchange", globalThis);
    traceGetter("window.onselectionchange", "Window", value);
    return value;
  },
  set onselectionchange(value) {
    setWindowEventHandler("onselectionchange", value, globalThis);
    traceSetter("window.onselectionchange", "Window", value);
  },
}, "onselectionchange");

export function installOnselectionchangeGlobal() {
  registerNativeGetter(descriptor.get, "onselectionchange");
  registerNativeFunction(descriptor.set, "set onselectionchange");
  Object.defineProperty(globalThis, "onselectionchange", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

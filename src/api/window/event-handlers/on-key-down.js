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
  get onkeydown() {
    const value = getWindowEventHandler("onkeydown", globalThis);
    traceGetter("window.onkeydown", "Window", value);
    return value;
  },
  set onkeydown(value) {
    setWindowEventHandler("onkeydown", value, globalThis);
    traceSetter("window.onkeydown", "Window", value);
  },
}, "onkeydown");

export function installOnkeydownGlobal() {
  registerNativeGetter(descriptor.get, "onkeydown");
  registerNativeFunction(descriptor.set, "set onkeydown");
  Object.defineProperty(globalThis, "onkeydown", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

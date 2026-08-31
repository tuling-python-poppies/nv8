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
  get onkeyup() {
    const value = getWindowEventHandler("onkeyup", globalThis);
    traceGetter("window.onkeyup", "Window", value);
    return value;
  },
  set onkeyup(value) {
    setWindowEventHandler("onkeyup", value, globalThis);
    traceSetter("window.onkeyup", "Window", value);
  },
}, "onkeyup");

export function installOnkeyupGlobal() {
  registerNativeGetter(descriptor.get, "onkeyup");
  registerNativeFunction(descriptor.set, "set onkeyup");
  Object.defineProperty(globalThis, "onkeyup", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

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
  get onpause() {
    const value = getWindowEventHandler("onpause", globalThis);
    traceGetter("window.onpause", "Window", value);
    return value;
  },
  set onpause(value) {
    setWindowEventHandler("onpause", value, globalThis);
    traceSetter("window.onpause", "Window", value);
  },
}, "onpause");

export function installOnpauseGlobal() {
  registerNativeGetter(descriptor.get, "onpause");
  registerNativeFunction(descriptor.set, "set onpause");
  Object.defineProperty(globalThis, "onpause", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

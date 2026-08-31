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
  get onbeforeunload() {
    const value = getWindowEventHandler("onbeforeunload", globalThis);
    traceGetter("window.onbeforeunload", "Window", value);
    return value;
  },
  set onbeforeunload(value) {
    setWindowEventHandler("onbeforeunload", value, globalThis);
    traceSetter("window.onbeforeunload", "Window", value);
  },
}, "onbeforeunload");

export function installOnbeforeunloadGlobal() {
  registerNativeGetter(descriptor.get, "onbeforeunload");
  registerNativeFunction(descriptor.set, "set onbeforeunload");
  Object.defineProperty(globalThis, "onbeforeunload", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

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
  get oncommand() {
    const value = getWindowEventHandler("oncommand", globalThis);
    traceGetter("window.oncommand", "Window", value);
    return value;
  },
  set oncommand(value) {
    setWindowEventHandler("oncommand", value, globalThis);
    traceSetter("window.oncommand", "Window", value);
  },
}, "oncommand");

export function installOncommandGlobal() {
  registerNativeGetter(descriptor.get, "oncommand");
  registerNativeFunction(descriptor.set, "set oncommand");
  Object.defineProperty(globalThis, "oncommand", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

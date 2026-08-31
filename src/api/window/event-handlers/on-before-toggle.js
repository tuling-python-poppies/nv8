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
  get onbeforetoggle() {
    const value = getWindowEventHandler("onbeforetoggle", globalThis);
    traceGetter("window.onbeforetoggle", "Window", value);
    return value;
  },
  set onbeforetoggle(value) {
    setWindowEventHandler("onbeforetoggle", value, globalThis);
    traceSetter("window.onbeforetoggle", "Window", value);
  },
}, "onbeforetoggle");

export function installOnbeforetoggleGlobal() {
  registerNativeGetter(descriptor.get, "onbeforetoggle");
  registerNativeFunction(descriptor.set, "set onbeforetoggle");
  Object.defineProperty(globalThis, "onbeforetoggle", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

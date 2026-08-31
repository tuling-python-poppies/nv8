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
  get onformdata() {
    const value = getWindowEventHandler("onformdata", globalThis);
    traceGetter("window.onformdata", "Window", value);
    return value;
  },
  set onformdata(value) {
    setWindowEventHandler("onformdata", value, globalThis);
    traceSetter("window.onformdata", "Window", value);
  },
}, "onformdata");

export function installOnformdataGlobal() {
  registerNativeGetter(descriptor.get, "onformdata");
  registerNativeFunction(descriptor.set, "set onformdata");
  Object.defineProperty(globalThis, "onformdata", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

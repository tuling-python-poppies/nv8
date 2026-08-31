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
  get onprogress() {
    const value = getWindowEventHandler("onprogress", globalThis);
    traceGetter("window.onprogress", "Window", value);
    return value;
  },
  set onprogress(value) {
    setWindowEventHandler("onprogress", value, globalThis);
    traceSetter("window.onprogress", "Window", value);
  },
}, "onprogress");

export function installOnprogressGlobal() {
  registerNativeGetter(descriptor.get, "onprogress");
  registerNativeFunction(descriptor.set, "set onprogress");
  Object.defineProperty(globalThis, "onprogress", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

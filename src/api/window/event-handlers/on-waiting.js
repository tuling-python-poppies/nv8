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
  get onwaiting() {
    const value = getWindowEventHandler("onwaiting", globalThis);
    traceGetter("window.onwaiting", "Window", value);
    return value;
  },
  set onwaiting(value) {
    setWindowEventHandler("onwaiting", value, globalThis);
    traceSetter("window.onwaiting", "Window", value);
  },
}, "onwaiting");

export function installOnwaitingGlobal() {
  registerNativeGetter(descriptor.get, "onwaiting");
  registerNativeFunction(descriptor.set, "set onwaiting");
  Object.defineProperty(globalThis, "onwaiting", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

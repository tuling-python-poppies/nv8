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
  get ondurationchange() {
    const value = getWindowEventHandler("ondurationchange", globalThis);
    traceGetter("window.ondurationchange", "Window", value);
    return value;
  },
  set ondurationchange(value) {
    setWindowEventHandler("ondurationchange", value, globalThis);
    traceSetter("window.ondurationchange", "Window", value);
  },
}, "ondurationchange");

export function installOndurationchangeGlobal() {
  registerNativeGetter(descriptor.get, "ondurationchange");
  registerNativeFunction(descriptor.set, "set ondurationchange");
  Object.defineProperty(globalThis, "ondurationchange", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

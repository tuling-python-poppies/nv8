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
  get ondragstart() {
    const value = getWindowEventHandler("ondragstart", globalThis);
    traceGetter("window.ondragstart", "Window", value);
    return value;
  },
  set ondragstart(value) {
    setWindowEventHandler("ondragstart", value, globalThis);
    traceSetter("window.ondragstart", "Window", value);
  },
}, "ondragstart");

export function installOndragstartGlobal() {
  registerNativeGetter(descriptor.get, "ondragstart");
  registerNativeFunction(descriptor.set, "set ondragstart");
  Object.defineProperty(globalThis, "ondragstart", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

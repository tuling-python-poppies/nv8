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
  get ondragenter() {
    const value = getWindowEventHandler("ondragenter", globalThis);
    traceGetter("window.ondragenter", "Window", value);
    return value;
  },
  set ondragenter(value) {
    setWindowEventHandler("ondragenter", value, globalThis);
    traceSetter("window.ondragenter", "Window", value);
  },
}, "ondragenter");

export function installOndragenterGlobal() {
  registerNativeGetter(descriptor.get, "ondragenter");
  registerNativeFunction(descriptor.set, "set ondragenter");
  Object.defineProperty(globalThis, "ondragenter", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

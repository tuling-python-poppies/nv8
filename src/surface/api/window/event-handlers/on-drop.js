import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../../../engine/webidl/native-function.js";
import {
  traceGetter,
  traceSetter,
} from "../../../../infra/trace/trace-accessor.js";
import {
  getWindowEventHandler,
  setWindowEventHandler,
} from "../window-event-handler-state.js";

const descriptor = Object.getOwnPropertyDescriptor({
  get ondrop() {
    const value = getWindowEventHandler("ondrop", globalThis);
    traceGetter("window.ondrop", "Window", value);
    return value;
  },
  set ondrop(value) {
    setWindowEventHandler("ondrop", value, globalThis);
    traceSetter("window.ondrop", "Window", value);
  },
}, "ondrop");

export function installOndropGlobal() {
  registerNativeGetter(descriptor.get, "ondrop");
  registerNativeFunction(descriptor.set, "set ondrop");
  Object.defineProperty(globalThis, "ondrop", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

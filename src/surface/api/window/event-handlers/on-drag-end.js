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
  get ondragend() {
    const value = getWindowEventHandler("ondragend", globalThis);
    traceGetter("window.ondragend", "Window", value);
    return value;
  },
  set ondragend(value) {
    setWindowEventHandler("ondragend", value, globalThis);
    traceSetter("window.ondragend", "Window", value);
  },
}, "ondragend");

export function installOndragendGlobal() {
  registerNativeGetter(descriptor.get, "ondragend");
  registerNativeFunction(descriptor.set, "set ondragend");
  Object.defineProperty(globalThis, "ondragend", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

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
  get ontransitionend() {
    const value = getWindowEventHandler("ontransitionend", globalThis);
    traceGetter("window.ontransitionend", "Window", value);
    return value;
  },
  set ontransitionend(value) {
    setWindowEventHandler("ontransitionend", value, globalThis);
    traceSetter("window.ontransitionend", "Window", value);
  },
}, "ontransitionend");

export function installOntransitionendGlobal() {
  registerNativeGetter(descriptor.get, "ontransitionend");
  registerNativeFunction(descriptor.set, "set ontransitionend");
  Object.defineProperty(globalThis, "ontransitionend", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

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
  get ontransitioncancel() {
    const value = getWindowEventHandler("ontransitioncancel", globalThis);
    traceGetter("window.ontransitioncancel", "Window", value);
    return value;
  },
  set ontransitioncancel(value) {
    setWindowEventHandler("ontransitioncancel", value, globalThis);
    traceSetter("window.ontransitioncancel", "Window", value);
  },
}, "ontransitioncancel");

export function installOntransitioncancelGlobal() {
  registerNativeGetter(descriptor.get, "ontransitioncancel");
  registerNativeFunction(descriptor.set, "set ontransitioncancel");
  Object.defineProperty(globalThis, "ontransitioncancel", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

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
  get ontransitionstart() {
    const value = getWindowEventHandler("ontransitionstart", globalThis);
    traceGetter("window.ontransitionstart", "Window", value);
    return value;
  },
  set ontransitionstart(value) {
    setWindowEventHandler("ontransitionstart", value, globalThis);
    traceSetter("window.ontransitionstart", "Window", value);
  },
}, "ontransitionstart");

export function installOntransitionstartGlobal() {
  registerNativeGetter(descriptor.get, "ontransitionstart");
  registerNativeFunction(descriptor.set, "set ontransitionstart");
  Object.defineProperty(globalThis, "ontransitionstart", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

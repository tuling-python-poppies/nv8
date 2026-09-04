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
  get ontransitionrun() {
    const value = getWindowEventHandler("ontransitionrun", globalThis);
    traceGetter("window.ontransitionrun", "Window", value);
    return value;
  },
  set ontransitionrun(value) {
    setWindowEventHandler("ontransitionrun", value, globalThis);
    traceSetter("window.ontransitionrun", "Window", value);
  },
}, "ontransitionrun");

export function installOntransitionrunGlobal() {
  registerNativeGetter(descriptor.get, "ontransitionrun");
  registerNativeFunction(descriptor.set, "set ontransitionrun");
  Object.defineProperty(globalThis, "ontransitionrun", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

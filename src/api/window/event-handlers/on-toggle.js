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
  get ontoggle() {
    const value = getWindowEventHandler("ontoggle", globalThis);
    traceGetter("window.ontoggle", "Window", value);
    return value;
  },
  set ontoggle(value) {
    setWindowEventHandler("ontoggle", value, globalThis);
    traceSetter("window.ontoggle", "Window", value);
  },
}, "ontoggle");

export function installOntoggleGlobal() {
  registerNativeGetter(descriptor.get, "ontoggle");
  registerNativeFunction(descriptor.set, "set ontoggle");
  Object.defineProperty(globalThis, "ontoggle", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

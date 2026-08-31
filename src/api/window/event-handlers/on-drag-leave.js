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
  get ondragleave() {
    const value = getWindowEventHandler("ondragleave", globalThis);
    traceGetter("window.ondragleave", "Window", value);
    return value;
  },
  set ondragleave(value) {
    setWindowEventHandler("ondragleave", value, globalThis);
    traceSetter("window.ondragleave", "Window", value);
  },
}, "ondragleave");

export function installOndragleaveGlobal() {
  registerNativeGetter(descriptor.get, "ondragleave");
  registerNativeFunction(descriptor.set, "set ondragleave");
  Object.defineProperty(globalThis, "ondragleave", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

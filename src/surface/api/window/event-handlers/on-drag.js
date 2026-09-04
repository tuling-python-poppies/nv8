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
  get ondrag() {
    const value = getWindowEventHandler("ondrag", globalThis);
    traceGetter("window.ondrag", "Window", value);
    return value;
  },
  set ondrag(value) {
    setWindowEventHandler("ondrag", value, globalThis);
    traceSetter("window.ondrag", "Window", value);
  },
}, "ondrag");

export function installOndragGlobal() {
  registerNativeGetter(descriptor.get, "ondrag");
  registerNativeFunction(descriptor.set, "set ondrag");
  Object.defineProperty(globalThis, "ondrag", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

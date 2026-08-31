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
  get ondragover() {
    const value = getWindowEventHandler("ondragover", globalThis);
    traceGetter("window.ondragover", "Window", value);
    return value;
  },
  set ondragover(value) {
    setWindowEventHandler("ondragover", value, globalThis);
    traceSetter("window.ondragover", "Window", value);
  },
}, "ondragover");

export function installOndragoverGlobal() {
  registerNativeGetter(descriptor.get, "ondragover");
  registerNativeFunction(descriptor.set, "set ondragover");
  Object.defineProperty(globalThis, "ondragover", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

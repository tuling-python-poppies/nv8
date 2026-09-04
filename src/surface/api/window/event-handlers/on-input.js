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
  get oninput() {
    const value = getWindowEventHandler("oninput", globalThis);
    traceGetter("window.oninput", "Window", value);
    return value;
  },
  set oninput(value) {
    setWindowEventHandler("oninput", value, globalThis);
    traceSetter("window.oninput", "Window", value);
  },
}, "oninput");

export function installOninputGlobal() {
  registerNativeGetter(descriptor.get, "oninput");
  registerNativeFunction(descriptor.set, "set oninput");
  Object.defineProperty(globalThis, "oninput", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

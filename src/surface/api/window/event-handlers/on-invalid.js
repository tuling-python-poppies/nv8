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
  get oninvalid() {
    const value = getWindowEventHandler("oninvalid", globalThis);
    traceGetter("window.oninvalid", "Window", value);
    return value;
  },
  set oninvalid(value) {
    setWindowEventHandler("oninvalid", value, globalThis);
    traceSetter("window.oninvalid", "Window", value);
  },
}, "oninvalid");

export function installOninvalidGlobal() {
  registerNativeGetter(descriptor.get, "oninvalid");
  registerNativeFunction(descriptor.set, "set oninvalid");
  Object.defineProperty(globalThis, "oninvalid", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

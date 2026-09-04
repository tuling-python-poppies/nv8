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
  get ondblclick() {
    const value = getWindowEventHandler("ondblclick", globalThis);
    traceGetter("window.ondblclick", "Window", value);
    return value;
  },
  set ondblclick(value) {
    setWindowEventHandler("ondblclick", value, globalThis);
    traceSetter("window.ondblclick", "Window", value);
  },
}, "ondblclick");

export function installOndblclickGlobal() {
  registerNativeGetter(descriptor.get, "ondblclick");
  registerNativeFunction(descriptor.set, "set ondblclick");
  Object.defineProperty(globalThis, "ondblclick", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

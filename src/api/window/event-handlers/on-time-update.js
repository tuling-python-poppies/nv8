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
  get ontimeupdate() {
    const value = getWindowEventHandler("ontimeupdate", globalThis);
    traceGetter("window.ontimeupdate", "Window", value);
    return value;
  },
  set ontimeupdate(value) {
    setWindowEventHandler("ontimeupdate", value, globalThis);
    traceSetter("window.ontimeupdate", "Window", value);
  },
}, "ontimeupdate");

export function installOntimeupdateGlobal() {
  registerNativeGetter(descriptor.get, "ontimeupdate");
  registerNativeFunction(descriptor.set, "set ontimeupdate");
  Object.defineProperty(globalThis, "ontimeupdate", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

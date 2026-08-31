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
  get onanimationend() {
    const value = getWindowEventHandler("onanimationend", globalThis);
    traceGetter("window.onanimationend", "Window", value);
    return value;
  },
  set onanimationend(value) {
    setWindowEventHandler("onanimationend", value, globalThis);
    traceSetter("window.onanimationend", "Window", value);
  },
}, "onanimationend");

export function installOnanimationendGlobal() {
  registerNativeGetter(descriptor.get, "onanimationend");
  registerNativeFunction(descriptor.set, "set onanimationend");
  Object.defineProperty(globalThis, "onanimationend", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

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
  get onanimationcancel() {
    const value = getWindowEventHandler("onanimationcancel", globalThis);
    traceGetter("window.onanimationcancel", "Window", value);
    return value;
  },
  set onanimationcancel(value) {
    setWindowEventHandler("onanimationcancel", value, globalThis);
    traceSetter("window.onanimationcancel", "Window", value);
  },
}, "onanimationcancel");

export function installOnanimationcancelGlobal() {
  registerNativeGetter(descriptor.get, "onanimationcancel");
  registerNativeFunction(descriptor.set, "set onanimationcancel");
  Object.defineProperty(globalThis, "onanimationcancel", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

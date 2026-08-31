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
  get onanimationstart() {
    const value = getWindowEventHandler("onanimationstart", globalThis);
    traceGetter("window.onanimationstart", "Window", value);
    return value;
  },
  set onanimationstart(value) {
    setWindowEventHandler("onanimationstart", value, globalThis);
    traceSetter("window.onanimationstart", "Window", value);
  },
}, "onanimationstart");

export function installOnanimationstartGlobal() {
  registerNativeGetter(descriptor.get, "onanimationstart");
  registerNativeFunction(descriptor.set, "set onanimationstart");
  Object.defineProperty(globalThis, "onanimationstart", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

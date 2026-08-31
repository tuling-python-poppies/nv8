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
  get onanimationiteration() {
    const value = getWindowEventHandler("onanimationiteration", globalThis);
    traceGetter("window.onanimationiteration", "Window", value);
    return value;
  },
  set onanimationiteration(value) {
    setWindowEventHandler("onanimationiteration", value, globalThis);
    traceSetter("window.onanimationiteration", "Window", value);
  },
}, "onanimationiteration");

export function installOnanimationiterationGlobal() {
  registerNativeGetter(descriptor.get, "onanimationiteration");
  registerNativeFunction(descriptor.set, "set onanimationiteration");
  Object.defineProperty(globalThis, "onanimationiteration", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

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
  get oncontentvisibilityautostatechange() {
    const value = getWindowEventHandler("oncontentvisibilityautostatechange", globalThis);
    traceGetter("window.oncontentvisibilityautostatechange", "Window", value);
    return value;
  },
  set oncontentvisibilityautostatechange(value) {
    setWindowEventHandler("oncontentvisibilityautostatechange", value, globalThis);
    traceSetter("window.oncontentvisibilityautostatechange", "Window", value);
  },
}, "oncontentvisibilityautostatechange");

export function installOncontentvisibilityautostatechangeGlobal() {
  registerNativeGetter(descriptor.get, "oncontentvisibilityautostatechange");
  registerNativeFunction(descriptor.set, "set oncontentvisibilityautostatechange");
  Object.defineProperty(globalThis, "oncontentvisibilityautostatechange", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

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
  get onauxclick() {
    const value = getWindowEventHandler("onauxclick", globalThis);
    traceGetter("window.onauxclick", "Window", value);
    return value;
  },
  set onauxclick(value) {
    setWindowEventHandler("onauxclick", value, globalThis);
    traceSetter("window.onauxclick", "Window", value);
  },
}, "onauxclick");

export function installOnauxclickGlobal() {
  registerNativeGetter(descriptor.get, "onauxclick");
  registerNativeFunction(descriptor.set, "set onauxclick");
  Object.defineProperty(globalThis, "onauxclick", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

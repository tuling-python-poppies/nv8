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
  get onvolumechange() {
    const value = getWindowEventHandler("onvolumechange", globalThis);
    traceGetter("window.onvolumechange", "Window", value);
    return value;
  },
  set onvolumechange(value) {
    setWindowEventHandler("onvolumechange", value, globalThis);
    traceSetter("window.onvolumechange", "Window", value);
  },
}, "onvolumechange");

export function installOnvolumechangeGlobal() {
  registerNativeGetter(descriptor.get, "onvolumechange");
  registerNativeFunction(descriptor.set, "set onvolumechange");
  Object.defineProperty(globalThis, "onvolumechange", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

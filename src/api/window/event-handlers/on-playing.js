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
  get onplaying() {
    const value = getWindowEventHandler("onplaying", globalThis);
    traceGetter("window.onplaying", "Window", value);
    return value;
  },
  set onplaying(value) {
    setWindowEventHandler("onplaying", value, globalThis);
    traceSetter("window.onplaying", "Window", value);
  },
}, "onplaying");

export function installOnplayingGlobal() {
  registerNativeGetter(descriptor.get, "onplaying");
  registerNativeFunction(descriptor.set, "set onplaying");
  Object.defineProperty(globalThis, "onplaying", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

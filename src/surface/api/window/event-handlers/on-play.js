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
  get onplay() {
    const value = getWindowEventHandler("onplay", globalThis);
    traceGetter("window.onplay", "Window", value);
    return value;
  },
  set onplay(value) {
    setWindowEventHandler("onplay", value, globalThis);
    traceSetter("window.onplay", "Window", value);
  },
}, "onplay");

export function installOnplayGlobal() {
  registerNativeGetter(descriptor.get, "onplay");
  registerNativeFunction(descriptor.set, "set onplay");
  Object.defineProperty(globalThis, "onplay", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

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
  get oncanplay() {
    const value = getWindowEventHandler("oncanplay", globalThis);
    traceGetter("window.oncanplay", "Window", value);
    return value;
  },
  set oncanplay(value) {
    setWindowEventHandler("oncanplay", value, globalThis);
    traceSetter("window.oncanplay", "Window", value);
  },
}, "oncanplay");

export function installOncanplayGlobal() {
  registerNativeGetter(descriptor.get, "oncanplay");
  registerNativeFunction(descriptor.set, "set oncanplay");
  Object.defineProperty(globalThis, "oncanplay", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

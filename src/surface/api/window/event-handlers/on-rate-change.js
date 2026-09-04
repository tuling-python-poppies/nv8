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
  get onratechange() {
    const value = getWindowEventHandler("onratechange", globalThis);
    traceGetter("window.onratechange", "Window", value);
    return value;
  },
  set onratechange(value) {
    setWindowEventHandler("onratechange", value, globalThis);
    traceSetter("window.onratechange", "Window", value);
  },
}, "onratechange");

export function installOnratechangeGlobal() {
  registerNativeGetter(descriptor.get, "onratechange");
  registerNativeFunction(descriptor.set, "set onratechange");
  Object.defineProperty(globalThis, "onratechange", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

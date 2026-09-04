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
  get onblur() {
    const value = getWindowEventHandler("onblur", globalThis);
    traceGetter("window.onblur", "Window", value);
    return value;
  },
  set onblur(value) {
    setWindowEventHandler("onblur", value, globalThis);
    traceSetter("window.onblur", "Window", value);
  },
}, "onblur");

export function installOnblurGlobal() {
  registerNativeGetter(descriptor.get, "onblur");
  registerNativeFunction(descriptor.set, "set onblur");
  Object.defineProperty(globalThis, "onblur", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

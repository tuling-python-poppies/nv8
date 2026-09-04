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
  get onhashchange() {
    const value = getWindowEventHandler("onhashchange", globalThis);
    traceGetter("window.onhashchange", "Window", value);
    return value;
  },
  set onhashchange(value) {
    setWindowEventHandler("onhashchange", value, globalThis);
    traceSetter("window.onhashchange", "Window", value);
  },
}, "onhashchange");

export function installOnhashchangeGlobal() {
  registerNativeGetter(descriptor.get, "onhashchange");
  registerNativeFunction(descriptor.set, "set onhashchange");
  Object.defineProperty(globalThis, "onhashchange", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

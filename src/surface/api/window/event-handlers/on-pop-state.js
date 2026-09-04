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
  get onpopstate() {
    const value = getWindowEventHandler("onpopstate", globalThis);
    traceGetter("window.onpopstate", "Window", value);
    return value;
  },
  set onpopstate(value) {
    setWindowEventHandler("onpopstate", value, globalThis);
    traceSetter("window.onpopstate", "Window", value);
  },
}, "onpopstate");

export function installOnpopstateGlobal() {
  registerNativeGetter(descriptor.get, "onpopstate");
  registerNativeFunction(descriptor.set, "set onpopstate");
  Object.defineProperty(globalThis, "onpopstate", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

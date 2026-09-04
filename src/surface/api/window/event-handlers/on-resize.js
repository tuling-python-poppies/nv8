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
  get onresize() {
    const value = getWindowEventHandler("onresize", globalThis);
    traceGetter("window.onresize", "Window", value);
    return value;
  },
  set onresize(value) {
    setWindowEventHandler("onresize", value, globalThis);
    traceSetter("window.onresize", "Window", value);
  },
}, "onresize");

export function installOnresizeGlobal() {
  registerNativeGetter(descriptor.get, "onresize");
  registerNativeFunction(descriptor.set, "set onresize");
  Object.defineProperty(globalThis, "onresize", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

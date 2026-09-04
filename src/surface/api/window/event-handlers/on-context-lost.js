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
  get oncontextlost() {
    const value = getWindowEventHandler("oncontextlost", globalThis);
    traceGetter("window.oncontextlost", "Window", value);
    return value;
  },
  set oncontextlost(value) {
    setWindowEventHandler("oncontextlost", value, globalThis);
    traceSetter("window.oncontextlost", "Window", value);
  },
}, "oncontextlost");

export function installOncontextlostGlobal() {
  registerNativeGetter(descriptor.get, "oncontextlost");
  registerNativeFunction(descriptor.set, "set oncontextlost");
  Object.defineProperty(globalThis, "oncontextlost", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

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
  get oncontextrestored() {
    const value = getWindowEventHandler("oncontextrestored", globalThis);
    traceGetter("window.oncontextrestored", "Window", value);
    return value;
  },
  set oncontextrestored(value) {
    setWindowEventHandler("oncontextrestored", value, globalThis);
    traceSetter("window.oncontextrestored", "Window", value);
  },
}, "oncontextrestored");

export function installOncontextrestoredGlobal() {
  registerNativeGetter(descriptor.get, "oncontextrestored");
  registerNativeFunction(descriptor.set, "set oncontextrestored");
  Object.defineProperty(globalThis, "oncontextrestored", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

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
  get onrejectionhandled() {
    const value = getWindowEventHandler("onrejectionhandled", globalThis);
    traceGetter("window.onrejectionhandled", "Window", value);
    return value;
  },
  set onrejectionhandled(value) {
    setWindowEventHandler("onrejectionhandled", value, globalThis);
    traceSetter("window.onrejectionhandled", "Window", value);
  },
}, "onrejectionhandled");

export function installOnrejectionhandledGlobal() {
  registerNativeGetter(descriptor.get, "onrejectionhandled");
  registerNativeFunction(descriptor.set, "set onrejectionhandled");
  Object.defineProperty(globalThis, "onrejectionhandled", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

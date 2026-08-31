import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../../webidl/native-function.js";
import {
  traceGetter,
  traceSetter,
} from "../../../trace/trace-accessor.js";
import {
  getWindowEventHandler,
  setWindowEventHandler,
} from "../window-event-handler-state.js";

const descriptor = Object.getOwnPropertyDescriptor({
  get onpointerdown() {
    const value = getWindowEventHandler("onpointerdown", globalThis);
    traceGetter("window.onpointerdown", "Window", value);
    return value;
  },
  set onpointerdown(value) {
    setWindowEventHandler("onpointerdown", value, globalThis);
    traceSetter("window.onpointerdown", "Window", value);
  },
}, "onpointerdown");

export function installOnpointerdownGlobal() {
  registerNativeGetter(descriptor.get, "onpointerdown");
  registerNativeFunction(descriptor.set, "set onpointerdown");
  Object.defineProperty(globalThis, "onpointerdown", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

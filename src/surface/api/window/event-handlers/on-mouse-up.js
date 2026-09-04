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
  get onmouseup() {
    const value = getWindowEventHandler("onmouseup", globalThis);
    traceGetter("window.onmouseup", "Window", value);
    return value;
  },
  set onmouseup(value) {
    setWindowEventHandler("onmouseup", value, globalThis);
    traceSetter("window.onmouseup", "Window", value);
  },
}, "onmouseup");

export function installOnmouseupGlobal() {
  registerNativeGetter(descriptor.get, "onmouseup");
  registerNativeFunction(descriptor.set, "set onmouseup");
  Object.defineProperty(globalThis, "onmouseup", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

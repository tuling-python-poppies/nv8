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
  get onwebkittransitionend() {
    const value = getWindowEventHandler("onwebkittransitionend", globalThis);
    traceGetter("window.onwebkittransitionend", "Window", value);
    return value;
  },
  set onwebkittransitionend(value) {
    setWindowEventHandler("onwebkittransitionend", value, globalThis);
    traceSetter("window.onwebkittransitionend", "Window", value);
  },
}, "onwebkittransitionend");

export function installOnwebkittransitionendGlobal() {
  registerNativeGetter(descriptor.get, "onwebkittransitionend");
  registerNativeFunction(descriptor.set, "set onwebkittransitionend");
  Object.defineProperty(globalThis, "onwebkittransitionend", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

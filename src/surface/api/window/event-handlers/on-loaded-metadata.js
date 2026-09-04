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
  get onloadedmetadata() {
    const value = getWindowEventHandler("onloadedmetadata", globalThis);
    traceGetter("window.onloadedmetadata", "Window", value);
    return value;
  },
  set onloadedmetadata(value) {
    setWindowEventHandler("onloadedmetadata", value, globalThis);
    traceSetter("window.onloadedmetadata", "Window", value);
  },
}, "onloadedmetadata");

export function installOnloadedmetadataGlobal() {
  registerNativeGetter(descriptor.get, "onloadedmetadata");
  registerNativeFunction(descriptor.set, "set onloadedmetadata");
  Object.defineProperty(globalThis, "onloadedmetadata", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

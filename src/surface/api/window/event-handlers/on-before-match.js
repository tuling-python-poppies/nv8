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
  get onbeforematch() {
    const value = getWindowEventHandler("onbeforematch", globalThis);
    traceGetter("window.onbeforematch", "Window", value);
    return value;
  },
  set onbeforematch(value) {
    setWindowEventHandler("onbeforematch", value, globalThis);
    traceSetter("window.onbeforematch", "Window", value);
  },
}, "onbeforematch");

export function installOnbeforematchGlobal() {
  registerNativeGetter(descriptor.get, "onbeforematch");
  registerNativeFunction(descriptor.set, "set onbeforematch");
  Object.defineProperty(globalThis, "onbeforematch", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

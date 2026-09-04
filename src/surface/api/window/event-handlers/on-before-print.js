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
  get onbeforeprint() {
    const value = getWindowEventHandler("onbeforeprint", globalThis);
    traceGetter("window.onbeforeprint", "Window", value);
    return value;
  },
  set onbeforeprint(value) {
    setWindowEventHandler("onbeforeprint", value, globalThis);
    traceSetter("window.onbeforeprint", "Window", value);
  },
}, "onbeforeprint");

export function installOnbeforeprintGlobal() {
  registerNativeGetter(descriptor.get, "onbeforeprint");
  registerNativeFunction(descriptor.set, "set onbeforeprint");
  Object.defineProperty(globalThis, "onbeforeprint", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

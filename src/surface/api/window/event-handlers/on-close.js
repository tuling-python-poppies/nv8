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
  get onclose() {
    const value = getWindowEventHandler("onclose", globalThis);
    traceGetter("window.onclose", "Window", value);
    return value;
  },
  set onclose(value) {
    setWindowEventHandler("onclose", value, globalThis);
    traceSetter("window.onclose", "Window", value);
  },
}, "onclose");

export function installOncloseGlobal() {
  registerNativeGetter(descriptor.get, "onclose");
  registerNativeFunction(descriptor.set, "set onclose");
  Object.defineProperty(globalThis, "onclose", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

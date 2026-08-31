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
  get onpointermove() {
    const value = getWindowEventHandler("onpointermove", globalThis);
    traceGetter("window.onpointermove", "Window", value);
    return value;
  },
  set onpointermove(value) {
    setWindowEventHandler("onpointermove", value, globalThis);
    traceSetter("window.onpointermove", "Window", value);
  },
}, "onpointermove");

export function installOnpointermoveGlobal() {
  registerNativeGetter(descriptor.get, "onpointermove");
  registerNativeFunction(descriptor.set, "set onpointermove");
  Object.defineProperty(globalThis, "onpointermove", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

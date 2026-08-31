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
  get onmousemove() {
    const value = getWindowEventHandler("onmousemove", globalThis);
    traceGetter("window.onmousemove", "Window", value);
    return value;
  },
  set onmousemove(value) {
    setWindowEventHandler("onmousemove", value, globalThis);
    traceSetter("window.onmousemove", "Window", value);
  },
}, "onmousemove");

export function installOnmousemoveGlobal() {
  registerNativeGetter(descriptor.get, "onmousemove");
  registerNativeFunction(descriptor.set, "set onmousemove");
  Object.defineProperty(globalThis, "onmousemove", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

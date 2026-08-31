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
  get onmouseover() {
    const value = getWindowEventHandler("onmouseover", globalThis);
    traceGetter("window.onmouseover", "Window", value);
    return value;
  },
  set onmouseover(value) {
    setWindowEventHandler("onmouseover", value, globalThis);
    traceSetter("window.onmouseover", "Window", value);
  },
}, "onmouseover");

export function installOnmouseoverGlobal() {
  registerNativeGetter(descriptor.get, "onmouseover");
  registerNativeFunction(descriptor.set, "set onmouseover");
  Object.defineProperty(globalThis, "onmouseover", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

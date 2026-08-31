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
  get onwebkitanimationend() {
    const value = getWindowEventHandler("onwebkitanimationend", globalThis);
    traceGetter("window.onwebkitanimationend", "Window", value);
    return value;
  },
  set onwebkitanimationend(value) {
    setWindowEventHandler("onwebkitanimationend", value, globalThis);
    traceSetter("window.onwebkitanimationend", "Window", value);
  },
}, "onwebkitanimationend");

export function installOnwebkitanimationendGlobal() {
  registerNativeGetter(descriptor.get, "onwebkitanimationend");
  registerNativeFunction(descriptor.set, "set onwebkitanimationend");
  Object.defineProperty(globalThis, "onwebkitanimationend", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

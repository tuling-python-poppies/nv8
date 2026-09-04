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
  get onwebkitanimationstart() {
    const value = getWindowEventHandler("onwebkitanimationstart", globalThis);
    traceGetter("window.onwebkitanimationstart", "Window", value);
    return value;
  },
  set onwebkitanimationstart(value) {
    setWindowEventHandler("onwebkitanimationstart", value, globalThis);
    traceSetter("window.onwebkitanimationstart", "Window", value);
  },
}, "onwebkitanimationstart");

export function installOnwebkitanimationstartGlobal() {
  registerNativeGetter(descriptor.get, "onwebkitanimationstart");
  registerNativeFunction(descriptor.set, "set onwebkitanimationstart");
  Object.defineProperty(globalThis, "onwebkitanimationstart", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

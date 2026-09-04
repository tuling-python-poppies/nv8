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
  get onwebkitanimationiteration() {
    const value = getWindowEventHandler("onwebkitanimationiteration", globalThis);
    traceGetter("window.onwebkitanimationiteration", "Window", value);
    return value;
  },
  set onwebkitanimationiteration(value) {
    setWindowEventHandler("onwebkitanimationiteration", value, globalThis);
    traceSetter("window.onwebkitanimationiteration", "Window", value);
  },
}, "onwebkitanimationiteration");

export function installOnwebkitanimationiterationGlobal() {
  registerNativeGetter(descriptor.get, "onwebkitanimationiteration");
  registerNativeFunction(descriptor.set, "set onwebkitanimationiteration");
  Object.defineProperty(globalThis, "onwebkitanimationiteration", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

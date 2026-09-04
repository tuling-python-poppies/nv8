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
  get oncanplaythrough() {
    const value = getWindowEventHandler("oncanplaythrough", globalThis);
    traceGetter("window.oncanplaythrough", "Window", value);
    return value;
  },
  set oncanplaythrough(value) {
    setWindowEventHandler("oncanplaythrough", value, globalThis);
    traceSetter("window.oncanplaythrough", "Window", value);
  },
}, "oncanplaythrough");

export function installOncanplaythroughGlobal() {
  registerNativeGetter(descriptor.get, "oncanplaythrough");
  registerNativeFunction(descriptor.set, "set oncanplaythrough");
  Object.defineProperty(globalThis, "oncanplaythrough", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

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
  get onpointerover() {
    const value = getWindowEventHandler("onpointerover", globalThis);
    traceGetter("window.onpointerover", "Window", value);
    return value;
  },
  set onpointerover(value) {
    setWindowEventHandler("onpointerover", value, globalThis);
    traceSetter("window.onpointerover", "Window", value);
  },
}, "onpointerover");

export function installOnpointeroverGlobal() {
  registerNativeGetter(descriptor.get, "onpointerover");
  registerNativeFunction(descriptor.set, "set onpointerover");
  Object.defineProperty(globalThis, "onpointerover", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

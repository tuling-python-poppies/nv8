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
  get onpointerout() {
    const value = getWindowEventHandler("onpointerout", globalThis);
    traceGetter("window.onpointerout", "Window", value);
    return value;
  },
  set onpointerout(value) {
    setWindowEventHandler("onpointerout", value, globalThis);
    traceSetter("window.onpointerout", "Window", value);
  },
}, "onpointerout");

export function installOnpointeroutGlobal() {
  registerNativeGetter(descriptor.get, "onpointerout");
  registerNativeFunction(descriptor.set, "set onpointerout");
  Object.defineProperty(globalThis, "onpointerout", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

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
  get onbeforexrselect() {
    const value = getWindowEventHandler("onbeforexrselect", globalThis);
    traceGetter("window.onbeforexrselect", "Window", value);
    return value;
  },
  set onbeforexrselect(value) {
    setWindowEventHandler("onbeforexrselect", value, globalThis);
    traceSetter("window.onbeforexrselect", "Window", value);
  },
}, "onbeforexrselect");

export function installOnbeforexrselectGlobal() {
  registerNativeGetter(descriptor.get, "onbeforexrselect");
  registerNativeFunction(descriptor.set, "set onbeforexrselect");
  Object.defineProperty(globalThis, "onbeforexrselect", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

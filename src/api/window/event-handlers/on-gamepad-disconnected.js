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
  get ongamepaddisconnected() {
    const value = getWindowEventHandler("ongamepaddisconnected", globalThis);
    traceGetter("window.ongamepaddisconnected", "Window", value);
    return value;
  },
  set ongamepaddisconnected(value) {
    setWindowEventHandler("ongamepaddisconnected", value, globalThis);
    traceSetter("window.ongamepaddisconnected", "Window", value);
  },
}, "ongamepaddisconnected");

export function installOngamepaddisconnectedGlobal() {
  registerNativeGetter(descriptor.get, "ongamepaddisconnected");
  registerNativeFunction(descriptor.set, "set ongamepaddisconnected");
  Object.defineProperty(globalThis, "ongamepaddisconnected", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

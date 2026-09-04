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
  get ongamepadconnected() {
    const value = getWindowEventHandler("ongamepadconnected", globalThis);
    traceGetter("window.ongamepadconnected", "Window", value);
    return value;
  },
  set ongamepadconnected(value) {
    setWindowEventHandler("ongamepadconnected", value, globalThis);
    traceSetter("window.ongamepadconnected", "Window", value);
  },
}, "ongamepadconnected");

export function installOngamepadconnectedGlobal() {
  registerNativeGetter(descriptor.get, "ongamepadconnected");
  registerNativeFunction(descriptor.set, "set ongamepadconnected");
  Object.defineProperty(globalThis, "ongamepadconnected", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

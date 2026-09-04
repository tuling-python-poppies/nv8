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
  get onpointerrawupdate() {
    const value = getWindowEventHandler("onpointerrawupdate", globalThis);
    traceGetter("window.onpointerrawupdate", "Window", value);
    return value;
  },
  set onpointerrawupdate(value) {
    setWindowEventHandler("onpointerrawupdate", value, globalThis);
    traceSetter("window.onpointerrawupdate", "Window", value);
  },
}, "onpointerrawupdate");

export function installOnpointerrawupdateGlobal() {
  registerNativeGetter(descriptor.get, "onpointerrawupdate");
  registerNativeFunction(descriptor.set, "set onpointerrawupdate");
  Object.defineProperty(globalThis, "onpointerrawupdate", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

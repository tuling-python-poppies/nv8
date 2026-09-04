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
  get oncontextmenu() {
    const value = getWindowEventHandler("oncontextmenu", globalThis);
    traceGetter("window.oncontextmenu", "Window", value);
    return value;
  },
  set oncontextmenu(value) {
    setWindowEventHandler("oncontextmenu", value, globalThis);
    traceSetter("window.oncontextmenu", "Window", value);
  },
}, "oncontextmenu");

export function installOncontextmenuGlobal() {
  registerNativeGetter(descriptor.get, "oncontextmenu");
  registerNativeFunction(descriptor.set, "set oncontextmenu");
  Object.defineProperty(globalThis, "oncontextmenu", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

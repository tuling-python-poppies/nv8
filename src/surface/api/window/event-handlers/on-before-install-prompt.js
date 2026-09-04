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
  get onbeforeinstallprompt() {
    const value = getWindowEventHandler("onbeforeinstallprompt", globalThis);
    traceGetter("window.onbeforeinstallprompt", "Window", value);
    return value;
  },
  set onbeforeinstallprompt(value) {
    setWindowEventHandler("onbeforeinstallprompt", value, globalThis);
    traceSetter("window.onbeforeinstallprompt", "Window", value);
  },
}, "onbeforeinstallprompt");

export function installOnbeforeinstallpromptGlobal() {
  registerNativeGetter(descriptor.get, "onbeforeinstallprompt");
  registerNativeFunction(descriptor.set, "set onbeforeinstallprompt");
  Object.defineProperty(globalThis, "onbeforeinstallprompt", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

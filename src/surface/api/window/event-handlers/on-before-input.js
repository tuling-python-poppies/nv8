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
  get onbeforeinput() {
    const value = getWindowEventHandler("onbeforeinput", globalThis);
    traceGetter("window.onbeforeinput", "Window", value);
    return value;
  },
  set onbeforeinput(value) {
    setWindowEventHandler("onbeforeinput", value, globalThis);
    traceSetter("window.onbeforeinput", "Window", value);
  },
}, "onbeforeinput");

export function installOnbeforeinputGlobal() {
  registerNativeGetter(descriptor.get, "onbeforeinput");
  registerNativeFunction(descriptor.set, "set onbeforeinput");
  Object.defineProperty(globalThis, "onbeforeinput", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

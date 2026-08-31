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
  get oncuechange() {
    const value = getWindowEventHandler("oncuechange", globalThis);
    traceGetter("window.oncuechange", "Window", value);
    return value;
  },
  set oncuechange(value) {
    setWindowEventHandler("oncuechange", value, globalThis);
    traceSetter("window.oncuechange", "Window", value);
  },
}, "oncuechange");

export function installOncuechangeGlobal() {
  registerNativeGetter(descriptor.get, "oncuechange");
  registerNativeFunction(descriptor.set, "set oncuechange");
  Object.defineProperty(globalThis, "oncuechange", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

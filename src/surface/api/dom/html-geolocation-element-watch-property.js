import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireGeolocationElement } from "./html-geolocation-element-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get watch() {
    const result = requireGeolocationElement(this).watch;
    traceGetter("window.HTMLGeolocationElement.prototype.watch", "HTMLGeolocationElement", result);
    return result;
  },
  set watch(value) {
    requireGeolocationElement(this).watch = Boolean(value);
  },
}, "watch");
export const watch = descriptor.get;
export const setWatch = descriptor.set;
registerNativeGetter(watch, "watch");
registerNativeFunction(setWatch, "set watch");

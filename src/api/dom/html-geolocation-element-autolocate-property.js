import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { requireGeolocationElement } from "./html-geolocation-element-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get autolocate() {
    const result = requireGeolocationElement(this).autolocate;
    traceGetter("window.HTMLGeolocationElement.prototype.autolocate", "HTMLGeolocationElement", result);
    return result;
  },
  set autolocate(value) {
    requireGeolocationElement(this).autolocate = Boolean(value);
  },
}, "autolocate");
export const autolocate = descriptor.get;
export const setAutolocate = descriptor.set;
registerNativeGetter(autolocate, "autolocate");
registerNativeFunction(setAutolocate, "set autolocate");

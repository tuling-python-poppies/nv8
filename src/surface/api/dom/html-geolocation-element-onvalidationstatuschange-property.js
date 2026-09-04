import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireGeolocationElement } from "./html-geolocation-element-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get onvalidationstatuschange() {
    const result = requireGeolocationElement(this).onvalidationstatuschange;
    traceGetter(
      "window.HTMLGeolocationElement.prototype.onvalidationstatuschange",
      "HTMLGeolocationElement",
      result,
    );
    return result;
  },
  set onvalidationstatuschange(value) {
    requireGeolocationElement(this).onvalidationstatuschange =
      typeof value === "function" ? value : null;
  },
}, "onvalidationstatuschange");
export const onvalidationstatuschange = descriptor.get;
export const setOnvalidationstatuschange = descriptor.set;
registerNativeGetter(onvalidationstatuschange, "onvalidationstatuschange");
registerNativeFunction(setOnvalidationstatuschange, "set onvalidationstatuschange");

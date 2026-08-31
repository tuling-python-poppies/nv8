import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { requireGeolocationElement } from "./html-geolocation-element-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get onpromptaction() {
    const result = requireGeolocationElement(this).onpromptaction;
    traceGetter("window.HTMLGeolocationElement.prototype.onpromptaction", "HTMLGeolocationElement", result);
    return result;
  },
  set onpromptaction(value) {
    requireGeolocationElement(this).onpromptaction =
      typeof value === "function" ? value : null;
  },
}, "onpromptaction");
export const onpromptaction = descriptor.get;
export const setOnpromptaction = descriptor.set;
registerNativeGetter(onpromptaction, "onpromptaction");
registerNativeFunction(setOnpromptaction, "set onpromptaction");

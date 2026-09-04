import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireGeolocationElement } from "./html-geolocation-element-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get onpromptdismiss() {
    const result = requireGeolocationElement(this).onpromptdismiss;
    traceGetter("window.HTMLGeolocationElement.prototype.onpromptdismiss", "HTMLGeolocationElement", result);
    return result;
  },
  set onpromptdismiss(value) {
    requireGeolocationElement(this).onpromptdismiss =
      typeof value === "function" ? value : null;
  },
}, "onpromptdismiss");
export const onpromptdismiss = descriptor.get;
export const setOnpromptdismiss = descriptor.set;
registerNativeGetter(onpromptdismiss, "onpromptdismiss");
registerNativeFunction(setOnpromptdismiss, "set onpromptdismiss");

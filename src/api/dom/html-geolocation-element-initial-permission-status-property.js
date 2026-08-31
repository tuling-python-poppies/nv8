import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireGeolocationElement } from "./html-geolocation-element-state.js";
export const initialPermissionStatus = Object.getOwnPropertyDescriptor({
  get initialPermissionStatus() {
    requireGeolocationElement(this);
    const result = "prompt";
    traceGetter("window.HTMLGeolocationElement.prototype.initialPermissionStatus", "HTMLGeolocationElement", result);
    return result;
  },
}, "initialPermissionStatus").get;
registerNativeGetter(initialPermissionStatus, "initialPermissionStatus");

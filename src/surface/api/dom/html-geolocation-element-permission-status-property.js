import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireGeolocationElement } from "./html-geolocation-element-state.js";
export const permissionStatus = Object.getOwnPropertyDescriptor({ get permissionStatus() {
  requireGeolocationElement(this);
  const result = "prompt";
  traceGetter("window.HTMLGeolocationElement.prototype.permissionStatus", "HTMLGeolocationElement", result);
  return result;
}}, "permissionStatus").get;
registerNativeGetter(permissionStatus, "permissionStatus");

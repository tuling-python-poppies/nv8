import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireGeolocationElement } from "./html-geolocation-element-state.js";
export const error = Object.getOwnPropertyDescriptor({ get error() {
  requireGeolocationElement(this);
  const result = null;
  traceGetter("window.HTMLGeolocationElement.prototype.error", "HTMLGeolocationElement", result);
  return result;
}}, "error").get;
registerNativeGetter(error, "error");

import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireGeolocationElement } from "./html-geolocation-element-state.js";
export const invalidReason = Object.getOwnPropertyDescriptor({ get invalidReason() {
  requireGeolocationElement(this);
  const result = "";
  traceGetter("window.HTMLGeolocationElement.prototype.invalidReason", "HTMLGeolocationElement", result);
  return result;
}}, "invalidReason").get;
registerNativeGetter(invalidReason, "invalidReason");

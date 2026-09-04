import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireGeolocationElement } from "./html-geolocation-element-state.js";
export const isValid = Object.getOwnPropertyDescriptor({ get isValid() {
  requireGeolocationElement(this);
  const result = false;
  traceGetter("window.HTMLGeolocationElement.prototype.isValid", "HTMLGeolocationElement", result);
  return result;
}}, "isValid").get;
registerNativeGetter(isValid, "isValid");

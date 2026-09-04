import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireGeolocationElement } from "./html-geolocation-element-state.js";
export const position = Object.getOwnPropertyDescriptor({ get position() {
  requireGeolocationElement(this);
  const result = null;
  traceGetter("window.HTMLGeolocationElement.prototype.position", "HTMLGeolocationElement", result);
  return result;
}}, "position").get;
registerNativeGetter(position, "position");

import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireTrackElement } from "./html-track-element-state.js";
export const readyState = Object.getOwnPropertyDescriptor({ get readyState() {
  const result = requireTrackElement(this).readyState;
  traceGetter("window.HTMLTrackElement.prototype.readyState", "HTMLTrackElement", result);
  return result;
}}, "readyState").get;
registerNativeGetter(readyState, "readyState");

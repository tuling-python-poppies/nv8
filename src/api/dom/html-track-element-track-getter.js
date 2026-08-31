import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireTrackElement } from "./html-track-element-state.js";
export const track = Object.getOwnPropertyDescriptor({ get track() {
  const result = requireTrackElement(this).track;
  traceGetter("window.HTMLTrackElement.prototype.track", "HTMLTrackElement", result);
  return result;
}}, "track").get;
registerNativeGetter(track, "track");

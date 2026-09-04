import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireTextTrack } from "./text-track-state.js";
export const label = Object.getOwnPropertyDescriptor({ get label() {
  const result = requireTextTrack(this).label;
  traceGetter("window.TextTrack.prototype.label", "TextTrack", result);
  return result;
}}, "label").get;
registerNativeGetter(label, "label");

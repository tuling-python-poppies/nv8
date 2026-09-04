import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireTextTrack } from "./text-track-state.js";
export const cues = Object.getOwnPropertyDescriptor({ get cues() {
  const result = requireTextTrack(this).cues;
  traceGetter("window.TextTrack.prototype.cues", "TextTrack", result);
  return result;
}}, "cues").get;
registerNativeGetter(cues, "cues");

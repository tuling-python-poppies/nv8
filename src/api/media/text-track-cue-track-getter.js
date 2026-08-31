import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireTextTrackCue } from "./text-track-cue-state.js";
export const track = Object.getOwnPropertyDescriptor({ get track() {
  const result = requireTextTrackCue(this).track;
  traceGetter("window.TextTrackCue.prototype.track", "TextTrackCue", result);
  return result;
}}, "track").get;
registerNativeGetter(track, "track");

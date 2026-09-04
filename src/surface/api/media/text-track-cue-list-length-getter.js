import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireTextTrackCueList } from "./text-track-cue-list-state.js";
export const length = Object.getOwnPropertyDescriptor({ get length() {
  const result = requireTextTrackCueList(this).items.length;
  traceGetter("window.TextTrackCueList.prototype.length", "TextTrackCueList", result);
  return result;
}}, "length").get;
registerNativeGetter(length, "length");

import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireTextTrackList } from "./text-track-list-state.js";
export const length = Object.getOwnPropertyDescriptor({ get length() {
  const result = requireTextTrackList(this).tracks.length;
  traceGetter("window.TextTrackList.prototype.length", "TextTrackList", result);
  return result;
}}, "length").get;
registerNativeGetter(length, "length");

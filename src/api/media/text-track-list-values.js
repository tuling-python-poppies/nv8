import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireTextTrackList } from "./text-track-list-state.js";
export const values = {
  values() {
    const result = requireTextTrackList(this).tracks.values();
    traceCall("window.TextTrackList.prototype.values", "TextTrackList", [], result);
    return result;
  },
}.values;
registerNativeFunction(values, "values");

import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireTextTrackCueList } from "./text-track-cue-list-state.js";
export const values = {
  values() {
    const result = requireTextTrackCueList(this).items.values();
    traceCall(
      "window.TextTrackCueList.prototype.values",
      "TextTrackCueList",
      [],
      result,
    );
    return result;
  },
}.values;
registerNativeFunction(values, "values");

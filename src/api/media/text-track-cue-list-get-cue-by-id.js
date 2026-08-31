import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireTextTrackCue } from "./text-track-cue-state.js";
import { requireTextTrackCueList } from "./text-track-cue-list-state.js";
export const getCueById = {
  getCueById(id) {
    const wanted = `${id}`;
    const result = requireTextTrackCueList(this).items.find(
      cue => requireTextTrackCue(cue).id === wanted,
    ) ?? null;
    traceCall(
      "window.TextTrackCueList.prototype.getCueById",
      "TextTrackCueList",
      [id],
      result,
    );
    return result;
  },
}.getCueById;
registerNativeFunction(getCueById, "getCueById");

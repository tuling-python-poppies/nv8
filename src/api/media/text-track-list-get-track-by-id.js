import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireTextTrack } from "./text-track-state.js";
import { requireTextTrackList } from "./text-track-list-state.js";
export const getTrackById = {
  getTrackById(id) {
    const wanted = `${id}`;
    const result = requireTextTrackList(this).tracks.find(
      track => requireTextTrack(track).id === wanted,
    ) ?? null;
    traceCall(
      "window.TextTrackList.prototype.getTrackById",
      "TextTrackList",
      [id],
      result,
    );
    return result;
  },
}.getTrackById;
registerNativeFunction(getTrackById, "getTrackById");

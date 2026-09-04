import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireMediaStreamTrack } from "./media-stream-track-state.js";
import { requireMediaStream } from "./media-stream-state.js";
export const getTrackById = {
  getTrackById(id) {
    const wanted = `${id}`;
    const result = requireMediaStream(this).tracks.find(
      track => requireMediaStreamTrack(track).id === wanted,
    ) ?? null;
    traceCall("window.MediaStream.prototype.getTrackById", "MediaStream", [id], result);
    return result;
  },
}.getTrackById;
registerNativeFunction(getTrackById, "getTrackById");

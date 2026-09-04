import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireMediaStreamTrack } from "./media-stream-track-state.js";
import { requireMediaStream } from "./media-stream-state.js";
export const getVideoTracks = {
  getVideoTracks() {
    const result = requireMediaStream(this).tracks.filter(
      track => requireMediaStreamTrack(track).kind === "video",
    );
    traceCall("window.MediaStream.prototype.getVideoTracks", "MediaStream", [], result);
    return result;
  },
}.getVideoTracks;
registerNativeFunction(getVideoTracks, "getVideoTracks");

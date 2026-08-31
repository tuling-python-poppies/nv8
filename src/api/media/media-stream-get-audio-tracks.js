import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireMediaStreamTrack } from "./media-stream-track-state.js";
import { requireMediaStream } from "./media-stream-state.js";
export const getAudioTracks = {
  getAudioTracks() {
    const result = requireMediaStream(this).tracks.filter(
      track => requireMediaStreamTrack(track).kind === "audio",
    );
    traceCall("window.MediaStream.prototype.getAudioTracks", "MediaStream", [], result);
    return result;
  },
}.getAudioTracks;
registerNativeFunction(getAudioTracks, "getAudioTracks");

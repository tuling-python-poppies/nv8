import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { isMediaStreamTrack } from "./media-stream-track-state.js";
import { requireMediaStream } from "./media-stream-state.js";
export const removeTrack = {
  removeTrack(track) {
    if (!isMediaStreamTrack(track)) {
      throw new TypeError("MediaStreamTrack object required");
    }
    const tracks = requireMediaStream(this).tracks;
    const index = tracks.indexOf(track);
    if (index >= 0) tracks.splice(index, 1);
    traceCall("window.MediaStream.prototype.removeTrack", "MediaStream", [track], undefined);
  },
}.removeTrack;
registerNativeFunction(removeTrack, "removeTrack");

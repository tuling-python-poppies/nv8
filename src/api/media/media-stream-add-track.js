import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { isMediaStreamTrack } from "./media-stream-track-state.js";
import { requireMediaStream } from "./media-stream-state.js";
export const addTrack = {
  addTrack(track) {
    if (arguments.length < 1) {
      throw new TypeError("MediaStream.addTrack requires 1 argument");
    }
    if (!isMediaStreamTrack(track)) {
      throw new TypeError("Failed to convert value to 'MediaStreamTrack'.");
    }
    const tracks = requireMediaStream(this).tracks;
    if (!tracks.includes(track)) tracks.push(track);
    traceCall("window.MediaStream.prototype.addTrack", "MediaStream", [track], undefined);
  },
}.addTrack;
registerNativeFunction(addTrack, "addTrack");

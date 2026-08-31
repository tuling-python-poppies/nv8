import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireMediaStreamTrackAudioStats } from "./media-stream-track-audio-stats-state.js";
export const toJSON = {
  toJSON() {
    const result = { ...requireMediaStreamTrackAudioStats(this) };
    traceCall("window.MediaStreamTrackAudioStats.prototype.toJSON", "MediaStreamTrackAudioStats", [], result);
    return result;
  },
}.toJSON;
registerNativeFunction(toJSON, "toJSON");

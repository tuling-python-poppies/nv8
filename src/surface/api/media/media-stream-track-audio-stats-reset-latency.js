import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireMediaStreamTrackAudioStats } from "./media-stream-track-audio-stats-state.js";
export const resetLatency = {
  resetLatency() {
    const state = requireMediaStreamTrackAudioStats(this);
    state.latency = 0;
    state.averageLatency = 0;
    state.minimumLatency = 0;
    state.maximumLatency = 0;
    traceCall("window.MediaStreamTrackAudioStats.prototype.resetLatency", "MediaStreamTrackAudioStats", [], undefined);
  },
}.resetLatency;
registerNativeFunction(resetLatency, "resetLatency");

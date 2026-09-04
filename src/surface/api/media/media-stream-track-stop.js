import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireMediaStreamTrack } from "./media-stream-track-state.js";
export const stop = {
  stop() {
    requireMediaStreamTrack(this).readyState = "ended";
    traceCall("window.MediaStreamTrack.prototype.stop", "MediaStreamTrack", [], undefined);
  },
}.stop;
registerNativeFunction(stop, "stop");

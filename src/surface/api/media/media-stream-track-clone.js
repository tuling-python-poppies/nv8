import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { cloneMediaStreamTrack } from "./media-stream-track-state.js";
export const clone = {
  clone() {
    const result = cloneMediaStreamTrack(this);
    traceCall("window.MediaStreamTrack.prototype.clone", "MediaStreamTrack", [], result);
    return result;
  },
}.clone;
registerNativeFunction(clone, "clone");

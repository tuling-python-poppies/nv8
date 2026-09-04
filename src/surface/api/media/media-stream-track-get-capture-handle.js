import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireMediaStreamTrack } from "./media-stream-track-state.js";
export const getCaptureHandle = {
  getCaptureHandle() {
    requireMediaStreamTrack(this);
    const result = null;
    traceCall("window.MediaStreamTrack.prototype.getCaptureHandle", "MediaStreamTrack", [], result);
    return result;
  },
}.getCaptureHandle;
registerNativeFunction(getCaptureHandle, "getCaptureHandle");

import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireMediaStreamTrack } from "./media-stream-track-state.js";
export const getConstraints = {
  getConstraints() {
    requireMediaStreamTrack(this);
    const result = {};
    traceCall("window.MediaStreamTrack.prototype.getConstraints", "MediaStreamTrack", [], result);
    return result;
  },
}.getConstraints;
registerNativeFunction(getConstraints, "getConstraints");

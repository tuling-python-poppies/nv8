import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { cloneMediaStream } from "./media-stream-state.js";
export const clone = {
  clone() {
    const result = cloneMediaStream(this);
    traceCall("window.MediaStream.prototype.clone", "MediaStream", [], result);
    return result;
  },
}.clone;
registerNativeFunction(clone, "clone");

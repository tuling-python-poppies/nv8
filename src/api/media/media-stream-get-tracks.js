import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireMediaStream } from "./media-stream-state.js";
export const getTracks = {
  getTracks() {
    const result = [...requireMediaStream(this).tracks];
    traceCall("window.MediaStream.prototype.getTracks", "MediaStream", [], result);
    return result;
  },
}.getTracks;
registerNativeFunction(getTracks, "getTracks");

import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import {
  requireCanvasCaptureMediaStreamTrack,
} from "./canvas-capture-media-stream-track-state.js";

export const requestFrame = {
  requestFrame() {
    requireCanvasCaptureMediaStreamTrack(this).requestedFrames += 1;
    traceCall(
      "window.CanvasCaptureMediaStreamTrack.prototype.requestFrame",
      "CanvasCaptureMediaStreamTrack",
      [],
      undefined,
    );
  },
}.requestFrame;
registerNativeFunction(requestFrame, "requestFrame");

import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireMediaElement } from "./html-media-element-state.js";
import { createMediaStream } from "./media-stream-state.js";

export const captureStream = {
  captureStream() {
    requireMediaElement(this);
    const result = createMediaStream();
    traceCall(
      "window.HTMLMediaElement.prototype.captureStream",
      "HTMLMediaElement",
      [],
      result,
    );
    return result;
  },
}.captureStream;
registerNativeFunction(captureStream, "captureStream");

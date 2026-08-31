import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireVideoElement } from "./html-video-element-state.js";

export const cancelVideoFrameCallback = {
  cancelVideoFrameCallback(handle) {
    requireVideoElement(this).callbacks.delete(Number(handle) >>> 0);
    traceCall(
      "window.HTMLVideoElement.prototype.cancelVideoFrameCallback",
      "HTMLVideoElement",
      [handle],
      undefined,
    );
  },
}.cancelVideoFrameCallback;
registerNativeFunction(cancelVideoFrameCallback, "cancelVideoFrameCallback");

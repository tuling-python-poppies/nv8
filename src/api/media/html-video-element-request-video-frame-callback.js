import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireVideoElement } from "./html-video-element-state.js";

export const requestVideoFrameCallback = {
  requestVideoFrameCallback(callback) {
    if (typeof callback !== "function") throw new TypeError("Callback must be callable");
    const state = requireVideoElement(this);
    const result = state.nextCallbackId;
    state.nextCallbackId = (state.nextCallbackId + 1) >>> 0 || 1;
    state.callbacks.set(result, callback);
    traceCall(
      "window.HTMLVideoElement.prototype.requestVideoFrameCallback",
      "HTMLVideoElement",
      [callback],
      result,
    );
    return result;
  },
}.requestVideoFrameCallback;
registerNativeFunction(requestVideoFrameCallback, "requestVideoFrameCallback");

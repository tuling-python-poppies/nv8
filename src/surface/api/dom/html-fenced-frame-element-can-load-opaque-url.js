import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
export const canLoadOpaqueURL = {
  canLoadOpaqueURL() {
    const result = false;
    traceCall(
      "window.HTMLFencedFrameElement.canLoadOpaqueURL",
      "HTMLFencedFrameElement",
      [],
      result,
    );
    return result;
  },
}.canLoadOpaqueURL;
registerNativeFunction(canLoadOpaqueURL, "canLoadOpaqueURL");

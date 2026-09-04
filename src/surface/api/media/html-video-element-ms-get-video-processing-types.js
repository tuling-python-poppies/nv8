import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireVideoElement } from "./html-video-element-state.js";

export const msGetVideoProcessingTypes = {
  msGetVideoProcessingTypes() {
    requireVideoElement(this);
    const result = [
      "bicubic",
      "lanczos",
      "cas",
      "default",
      "msSuperResolution",
      "msGraphicsDriverEnhancement",
    ];
    traceCall(
      "window.HTMLVideoElement.prototype.msGetVideoProcessingTypes",
      "HTMLVideoElement",
      [],
      result,
    );
    return result;
  },
}.msGetVideoProcessingTypes;
registerNativeFunction(msGetVideoProcessingTypes, "msGetVideoProcessingTypes");

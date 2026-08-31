import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import {
  requireCanvasCaptureMediaStreamTrack,
} from "./canvas-capture-media-stream-track-state.js";

export const canvas = Object.getOwnPropertyDescriptor({
  get canvas() {
    const result = requireCanvasCaptureMediaStreamTrack(this).canvas;
    traceGetter(
      "window.CanvasCaptureMediaStreamTrack.prototype.canvas",
      "CanvasCaptureMediaStreamTrack",
      result,
    );
    return result;
  },
}, "canvas").get;
registerNativeGetter(canvas, "canvas");

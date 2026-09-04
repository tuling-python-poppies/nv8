import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireImageBitmap } from "./image-bitmap-state.js";

export const close = {
  close() {
    const state = requireImageBitmap(this);
    state.closed = true;
    state.pixels = new Uint8ClampedArray();
    traceCall("window.ImageBitmap.prototype.close", "ImageBitmap", [], undefined);
  },
}.close;
registerNativeFunction(close, "close");

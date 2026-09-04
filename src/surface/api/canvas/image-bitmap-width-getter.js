import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireImageBitmap } from "./image-bitmap-state.js";

export const width = Object.getOwnPropertyDescriptor({
  get width() {
    const state = requireImageBitmap(this);
    const result = state.closed ? 0 : state.width;
    traceGetter("window.ImageBitmap.prototype.width", "ImageBitmap", result);
    return result;
  },
}, "width").get;
registerNativeGetter(width, "width");

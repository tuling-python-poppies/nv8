import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireImageBitmap } from "./image-bitmap-state.js";

export const height = Object.getOwnPropertyDescriptor({
  get height() {
    const state = requireImageBitmap(this);
    const result = state.closed ? 0 : state.height;
    traceGetter("window.ImageBitmap.prototype.height", "ImageBitmap", result);
    return result;
  },
}, "height").get;
registerNativeGetter(height, "height");

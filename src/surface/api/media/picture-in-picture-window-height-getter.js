import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requirePictureInPictureWindow } from "./picture-in-picture-window-state.js";
export const height = Object.getOwnPropertyDescriptor({
  get height() {
    const result = requirePictureInPictureWindow(this).height;
    traceGetter("window.PictureInPictureWindow.prototype.height", "PictureInPictureWindow", result);
    return result;
  },
}, "height").get;
registerNativeGetter(height, "height");

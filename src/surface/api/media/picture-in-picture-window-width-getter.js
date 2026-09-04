import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requirePictureInPictureWindow } from "./picture-in-picture-window-state.js";
export const width = Object.getOwnPropertyDescriptor({
  get width() {
    const result = requirePictureInPictureWindow(this).width;
    traceGetter("window.PictureInPictureWindow.prototype.width", "PictureInPictureWindow", result);
    return result;
  },
}, "width").get;
registerNativeGetter(width, "width");

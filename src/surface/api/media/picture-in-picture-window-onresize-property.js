import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requirePictureInPictureWindow } from "./picture-in-picture-window-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get onresize() {
    const result = requirePictureInPictureWindow(this).onresize;
    traceGetter("window.PictureInPictureWindow.prototype.onresize", "PictureInPictureWindow", result);
    return result;
  },
  set onresize(value) {
    requirePictureInPictureWindow(this).onresize =
      value === null || value === undefined ? null : value;
  },
}, "onresize");
export const onresize = descriptor.get;
export const setOnresize = descriptor.set;
registerNativeGetter(onresize, "onresize");
registerNativeFunction(setOnresize, "set onresize");

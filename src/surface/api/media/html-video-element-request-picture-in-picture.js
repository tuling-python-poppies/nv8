import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { createPictureInPictureWindow } from "./picture-in-picture-window-state.js";
import { requireVideoElement } from "./html-video-element-state.js";

export const requestPictureInPicture = {
  requestPictureInPicture() {
    const state = requireVideoElement(this);
    const result = state.disablePictureInPicture
      ? Promise.reject("Picture-in-Picture is disabled")
      : Promise.resolve(createPictureInPictureWindow(state.width, state.height));
    traceCall(
      "window.HTMLVideoElement.prototype.requestPictureInPicture",
      "HTMLVideoElement",
      [],
      result,
    );
    return result;
  },
}.requestPictureInPicture;
registerNativeFunction(requestPictureInPicture, "requestPictureInPicture");

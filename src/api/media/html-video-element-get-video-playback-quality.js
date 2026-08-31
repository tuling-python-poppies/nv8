import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireVideoElement } from "./html-video-element-state.js";
import { createVideoPlaybackQuality } from "./video-playback-quality-state.js";

export const getVideoPlaybackQuality = {
  getVideoPlaybackQuality() {
    const state = requireVideoElement(this);
    const result = createVideoPlaybackQuality(
      0,
      state.webkitDecodedFrameCount,
      state.webkitDroppedFrameCount,
      0,
    );
    traceCall(
      "window.HTMLVideoElement.prototype.getVideoPlaybackQuality",
      "HTMLVideoElement",
      [],
      result,
    );
    return result;
  },
}.getVideoPlaybackQuality;
registerNativeFunction(getVideoPlaybackQuality, "getVideoPlaybackQuality");

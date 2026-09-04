import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireMediaElement } from "./html-media-element-state.js";

export const pause = {
  pause() {
    requireMediaElement(this).paused = true;
    traceCall("window.HTMLMediaElement.prototype.pause", "HTMLMediaElement", [], undefined);
  },
}.pause;
registerNativeFunction(pause, "pause");

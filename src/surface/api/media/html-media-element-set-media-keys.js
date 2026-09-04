import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireMediaElement } from "./html-media-element-state.js";

export const setMediaKeys = {
  setMediaKeys(mediaKeys) {
    requireMediaElement(this).mediaKeys = mediaKeys === undefined ? null : mediaKeys;
    const result = Promise.resolve(undefined);
    traceCall(
      "window.HTMLMediaElement.prototype.setMediaKeys",
      "HTMLMediaElement",
      [mediaKeys],
      result,
    );
    return result;
  },
}.setMediaKeys;
registerNativeFunction(setMediaKeys, "setMediaKeys");

import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireMediaElement } from "./html-media-element-state.js";

export const setSinkId = {
  setSinkId(sinkId) {
    requireMediaElement(this).sinkId = `${sinkId}`;
    const result = Promise.resolve(undefined);
    traceCall(
      "window.HTMLMediaElement.prototype.setSinkId",
      "HTMLMediaElement",
      [sinkId],
      result,
    );
    return result;
  },
}.setSinkId;
registerNativeFunction(setSinkId, "setSinkId");

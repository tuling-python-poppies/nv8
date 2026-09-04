import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireFencedFrameConfig } from "./fenced-frame-config-state.js";
export const setSharedStorageContext = {
  setSharedStorageContext(context) {
    if (arguments.length < 1) {
      throw new TypeError(
        "Failed to execute 'setSharedStorageContext' on 'FencedFrameConfig': 1 argument required, but only 0 present.",
      );
    }
    requireFencedFrameConfig(this).sharedStorageContext = `${context}`;
    traceCall(
      "window.FencedFrameConfig.prototype.setSharedStorageContext",
      "FencedFrameConfig",
      [context],
      undefined,
    );
  },
}.setSharedStorageContext;
registerNativeFunction(setSharedStorageContext, "setSharedStorageContext");

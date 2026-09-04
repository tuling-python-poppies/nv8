import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireShadowRoot } from "./shadow-root-state.js";

export const getAnimations = {
  getAnimations() {
    requireShadowRoot(this);
    const result = [];
    traceCall(
      "window.ShadowRoot.prototype.getAnimations",
      "ShadowRoot",
      [],
      result,
    );
    return result;
  },
}.getAnimations;
registerNativeFunction(getAnimations, "getAnimations");

import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireShadowRoot } from "./shadow-root-state.js";

export const elementFromPoint = {
  elementFromPoint(x, y) {
    requireShadowRoot(this);
    const result = null;
    traceCall(
      "window.ShadowRoot.prototype.elementFromPoint",
      "ShadowRoot",
      [x, y],
      result,
    );
    return result;
  },
}.elementFromPoint;
registerNativeFunction(elementFromPoint, "elementFromPoint");

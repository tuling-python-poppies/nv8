import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireShadowRoot } from "./shadow-root-state.js";

export const elementsFromPoint = {
  elementsFromPoint(x, y) {
    requireShadowRoot(this);
    const result = [];
    traceCall(
      "window.ShadowRoot.prototype.elementsFromPoint",
      "ShadowRoot",
      [x, y],
      result,
    );
    return result;
  },
}.elementsFromPoint;
registerNativeFunction(elementsFromPoint, "elementsFromPoint");

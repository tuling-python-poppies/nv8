import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireCanvas2DContext } from "./canvas-2d-context-state.js";

export function canvasContextMethod(methodName, arity, operation) {
  const callback = {
    [methodName](...args) {
      const result = operation(requireCanvas2DContext(this), args, this);
      traceCall(
        `window.OffscreenCanvasRenderingContext2D.prototype.${methodName}`,
        "OffscreenCanvasRenderingContext2D",
        args,
        result,
      );
      return result;
    },
  }[methodName];
  Object.defineProperty(callback, "length", {
    value: arity,
    configurable: true,
  });
  registerNativeFunction(callback, methodName);
  return callback;
}

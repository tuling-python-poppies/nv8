import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireCanvasPattern } from "./canvas-pattern-state.js";

export const setTransform = {
  setTransform() {
    const value = arguments[0];
    if (value !== undefined && (value === null || typeof value !== "object")) {
      throw new TypeError("The transform must be a matrix");
    }
    const matrix = value === undefined
      ? [1, 0, 0, 1, 0, 0]
      : [
          numberProperty(value, "a", 1),
          numberProperty(value, "b", 0),
          numberProperty(value, "c", 0),
          numberProperty(value, "d", 1),
          numberProperty(value, "e", 0),
          numberProperty(value, "f", 0),
        ];
    requireCanvasPattern(this).transform = matrix;
    traceCall(
      "window.CanvasPattern.prototype.setTransform",
      "CanvasPattern",
      value === undefined ? [] : [value],
      undefined,
    );
  },
}.setTransform;
registerNativeFunction(setTransform, "setTransform");

function numberProperty(value, name, fallback) {
  return value[name] === undefined ? fallback : Number(value[name]);
}

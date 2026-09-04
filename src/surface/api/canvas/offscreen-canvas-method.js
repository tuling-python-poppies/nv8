import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireOffscreenCanvas } from "./offscreen-canvas-state.js";

export function offscreenCanvasMethod(name, arity, operation) {
  const callback = {
    [name](...args) {
      requireOffscreenCanvas(this);
      const result = operation(this, args);
      traceCall(`window.OffscreenCanvas.prototype.${name}`, "OffscreenCanvas", args, result);
      return result;
    },
  }[name];
  Object.defineProperty(callback, "length", { value: arity, configurable: true });
  registerNativeFunction(callback, name);
  return callback;
}

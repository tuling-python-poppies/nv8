import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireHTMLCanvasElement } from "./html-canvas-element-state.js";

export function htmlCanvasMethod(name, arity, operation) {
  const callback = {
    [name](...args) {
      requireHTMLCanvasElement(this);
      const result = operation(this, args);
      traceCall(
        `window.HTMLCanvasElement.prototype.${name}`,
        "HTMLCanvasElement",
        args,
        result,
      );
      return result;
    },
  }[name];
  Object.defineProperty(callback, "length", { value: arity, configurable: true });
  registerNativeFunction(callback, name);
  return callback;
}

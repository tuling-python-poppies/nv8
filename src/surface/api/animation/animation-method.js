import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";

export function animationMethod(name, arity, operation) {
  const callback = {
    [name](...args) {
      const result = operation(this, args);
      traceCall(`window.Animation.prototype.${name}`, "Animation", args, result);
      return result;
    },
  }[name];
  Object.defineProperty(callback, "length", { value: arity, configurable: true });
  registerNativeFunction(callback, name);
  return callback;
}

import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireElement } from "./element-state.js";

export function elementExtendedMethod(name, arity, operation) {
  const callback = {
    [name](...args) {
      requireElement(this);
      const result = operation(this, args);
      traceCall(`window.Element.prototype.${name}`, "Element", args, result);
      return result;
    },
  }[name];
  Object.defineProperty(callback, "length", { value: arity, configurable: true });
  registerNativeFunction(callback, name);
  return callback;
}

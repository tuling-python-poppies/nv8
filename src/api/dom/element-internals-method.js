import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireElementInternals } from "./element-internals-state.js";

export function elementInternalsMethod(name, arity, operation) {
  const callback = {
    [name](...args) {
      const result = operation(requireElementInternals(this), args);
      traceCall(`window.ElementInternals.prototype.${name}`, "ElementInternals", args, result);
      return result;
    },
  }[name];
  Object.defineProperty(callback, "length", { value: arity, configurable: true });
  registerNativeFunction(callback, name);
  return callback;
}

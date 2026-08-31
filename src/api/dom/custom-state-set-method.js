import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireCustomStateSet } from "./custom-state-set-state.js";

export function customStateSetMethod(name, arity, operation) {
  const callback = {
    [name](...args) {
      const result = operation(requireCustomStateSet(this), args, this);
      traceCall(`window.CustomStateSet.prototype.${name}`, "CustomStateSet", args, result);
      return result;
    },
  }[name];
  Object.defineProperty(callback, "length", { value: arity, configurable: true });
  registerNativeFunction(callback, name);
  return callback;
}

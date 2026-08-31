import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireStylePropertyMap } from "./style-property-map-state.js";

export function stylePropertyMapMethod(name, arity, operation) {
  const callback = {
    [name](...args) {
      const record = requireStylePropertyMap(this);
      const result = operation(record, args);
      traceCall(`window.StylePropertyMap.prototype.${name}`, "StylePropertyMap", args, result);
      return result;
    },
  }[name];
  Object.defineProperty(callback, "length", { value: arity, configurable: true });
  registerNativeFunction(callback, name);
  return callback;
}

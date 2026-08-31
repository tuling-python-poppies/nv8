import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireCSSGroupingRule } from "./css-grouping-rule-state.js";

export function cssGroupingRuleMethod(name, arity, operation) {
  const callback = {
    [name](...args) {
      const result = operation(requireCSSGroupingRule(this), args, this);
      traceCall(`window.CSSGroupingRule.prototype.${name}`, "CSSGroupingRule", args, result);
      return result;
    },
  }[name];
  Object.defineProperty(callback, "length", { value: arity, configurable: true });
  registerNativeFunction(callback, name);
  return callback;
}

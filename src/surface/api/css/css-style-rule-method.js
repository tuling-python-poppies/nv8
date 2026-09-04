import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireCSSStyleRule } from "./css-style-rule-state.js";

export function cssStyleRuleMethod(name, arity, operation) {
  const callback = {
    [name](...args) {
      const result = operation(requireCSSStyleRule(this), args, this);
      traceCall(`window.CSSStyleRule.prototype.${name}`, "CSSStyleRule", args, result);
      return result;
    },
  }[name];
  Object.defineProperty(callback, "length", { value: arity, configurable: true });
  registerNativeFunction(callback, name);
  return callback;
}

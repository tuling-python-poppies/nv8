import { traceCall } from "../../trace/trace-function.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../webidl/native-function.js";
import { requireCSSKeyframesRule } from "./css-keyframes-rule-state.js";

export function cssKeyframesRuleGetter(name, read) {
  const getter = function () {
    const result = read(requireCSSKeyframesRule(this), this);
    traceCall(`window.CSSKeyframesRule.prototype.${name}`, "CSSKeyframesRule", [], result);
    return result;
  };
  registerNativeGetter(getter, name);
  return getter;
}

export function cssKeyframesRuleMethod(name, arity, operation) {
  const callback = {
    [name](...args) {
      const result = operation(requireCSSKeyframesRule(this), args, this);
      traceCall(`window.CSSKeyframesRule.prototype.${name}`, "CSSKeyframesRule", args, result);
      return result;
    },
  }[name];
  Object.defineProperty(callback, "length", { value: arity, configurable: true });
  registerNativeFunction(callback, name);
  return callback;
}

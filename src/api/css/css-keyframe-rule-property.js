import { traceCall } from "../../trace/trace-function.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireCSSKeyframeRule } from "./css-keyframe-rule-state.js";

export function cssKeyframeRuleGetter(name, read) {
  const getter = function () {
    const result = read(requireCSSKeyframeRule(this));
    traceCall(`window.CSSKeyframeRule.prototype.${name}`, "CSSKeyframeRule", [], result);
    return result;
  };
  registerNativeGetter(getter, name);
  return getter;
}

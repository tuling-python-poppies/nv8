import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireCSSGroupingRule } from "./css-grouping-rule-state.js";

export function cssGroupingRuleReadonlyDescriptor(name, read) {
  const getter = {
    [`get ${name}`]() {
      const result = read(requireCSSGroupingRule(this), this);
      traceCall(`window.CSSGroupingRule.prototype.${name}`, "CSSGroupingRule", [], result);
      return result;
    },
  }[`get ${name}`];
  registerNativeFunction(getter, `get ${name}`);
  return { get: getter };
}

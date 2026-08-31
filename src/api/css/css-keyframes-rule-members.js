import { refreshCSSRuleList } from "./css-rule-list-state.js";
import {
  appendCSSKeyframeRule,
  deleteCSSKeyframeRule,
  findCSSKeyframeRule,
} from "./css-keyframes-rule-state.js";
import {
  cssKeyframesRuleGetter,
  cssKeyframesRuleMethod,
} from "./css-keyframes-rule-property.js";

export const name = cssKeyframesRuleGetter("name", record => record.name);
export const cssRules = cssKeyframesRuleGetter("cssRules", record => {
  refreshCSSRuleList(record.ruleList);
  return record.ruleList;
});
export const length = cssKeyframesRuleGetter("length", record => record.rules.length);
export const appendRule = cssKeyframesRuleMethod(
  "appendRule",
  1,
  (_record, args, rule) => appendCSSKeyframeRule(rule, args[0]),
);
export const deleteRule = cssKeyframesRuleMethod(
  "deleteRule",
  1,
  (_record, args, rule) => deleteCSSKeyframeRule(rule, args[0]),
);
export const findRule = cssKeyframesRuleMethod(
  "findRule",
  1,
  (_record, args, rule) => findCSSKeyframeRule(rule, args[0]),
);
export const values = cssKeyframesRuleMethod(
  "values",
  0,
  record => record.rules.values(),
);

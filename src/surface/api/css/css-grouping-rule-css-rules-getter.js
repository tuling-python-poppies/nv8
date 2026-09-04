import { refreshCSSRuleList } from "./css-rule-list-state.js";
import { cssGroupingRuleReadonlyDescriptor } from "./css-grouping-rule-property.js";

export const cssRules = cssGroupingRuleReadonlyDescriptor("cssRules", record => {
  refreshCSSRuleList(record.ruleList);
  return record.ruleList;
}).get;

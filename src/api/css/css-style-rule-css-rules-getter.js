import { refreshCSSRuleList } from "./css-rule-list-state.js";
import { cssStyleRuleReadonlyDescriptor } from "./css-style-rule-property.js";
export const cssRules = cssStyleRuleReadonlyDescriptor("cssRules", record => {
  refreshCSSRuleList(record.ruleList);
  return record.ruleList;
}).get;

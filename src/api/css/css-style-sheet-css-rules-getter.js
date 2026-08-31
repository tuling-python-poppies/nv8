import { refreshCSSRuleList } from "./css-rule-list-state.js";
import { cssStyleSheetReadonlyDescriptor } from "./css-style-sheet-property.js";
export const cssRules = cssStyleSheetReadonlyDescriptor("cssRules", record => {
  refreshCSSRuleList(record.ruleList);
  return record.ruleList;
}).get;

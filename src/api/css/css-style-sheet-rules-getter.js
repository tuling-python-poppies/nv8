import { refreshCSSRuleList } from "./css-rule-list-state.js";
import { cssStyleSheetReadonlyDescriptor } from "./css-style-sheet-property.js";
export const rules = cssStyleSheetReadonlyDescriptor("rules", record => {
  refreshCSSRuleList(record.ruleList);
  return record.ruleList;
}).get;

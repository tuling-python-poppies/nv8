import { refreshCSSRuleList } from "./css-rule-list-state.js";
import { cssStyleRuleMethod } from "./css-style-rule-method.js";
export const deleteRule = cssStyleRuleMethod("deleteRule", 1, (record, args) => {
  const index = Number(args[0]) >>> 0;
  if (index >= record.rules.length) throw new DOMException("The index is not in the allowed range.", "IndexSizeError");
  record.rules.splice(index, 1);
  refreshCSSRuleList(record.ruleList);
});

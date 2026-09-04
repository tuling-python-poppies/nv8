import { refreshCSSRuleList } from "./css-rule-list-state.js";
import { cssGroupingRuleMethod } from "./css-grouping-rule-method.js";

export const deleteRule = cssGroupingRuleMethod("deleteRule", 1, (record, args) => {
  const index = Number(args[0]) >>> 0;
  if (index >= record.rules.length) {
    throw new DOMException("The index is not in the allowed range.", "IndexSizeError");
  }
  record.rules.splice(index, 1);
  refreshCSSRuleList(record.ruleList);
});

import { parseSingleCSSRule } from "./css-parser.js";
import { refreshCSSRuleList } from "./css-rule-list-state.js";
import { cssGroupingRuleMethod } from "./css-grouping-rule-method.js";

export const insertRule = cssGroupingRuleMethod("insertRule", 1, (record, args, rule) => {
  const index = args.length < 2 ? 0 : Number(args[1]) >>> 0;
  if (index > record.rules.length) {
    throw new DOMException("The index is not in the allowed range.", "IndexSizeError");
  }
  const child = parseSingleCSSRule(args[0], rule.parentStyleSheet, rule);
  record.rules.splice(index, 0, child);
  refreshCSSRuleList(record.ruleList);
  return index;
});

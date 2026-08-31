import { parseSingleCSSRule } from "./css-parser.js";
import { refreshCSSRuleList } from "./css-rule-list-state.js";
import { requireCSSRule } from "./css-rule-state.js";
import { cssStyleRuleMethod } from "./css-style-rule-method.js";
export const insertRule = cssStyleRuleMethod("insertRule", 1, (record, args, rule) => {
  const index = args.length < 2 ? 0 : Number(args[1]) >>> 0;
  if (index > record.rules.length) throw new DOMException("The index is not in the allowed range.", "IndexSizeError");
  const parentStyleSheet = requireCSSRule(rule).parentStyleSheet;
  const child = parseSingleCSSRule(args[0], parentStyleSheet, rule);
  record.rules.splice(index, 0, child);
  refreshCSSRuleList(record.ruleList);
  return index;
});

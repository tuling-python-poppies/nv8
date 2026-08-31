import { initializeCSSConditionRule } from "./css-condition-rule-state.js";
import {
  initializeCSSGroupingRule,
  replaceCSSGroupingRules,
  requireCSSGroupingRule,
} from "./css-grouping-rule-state.js";
import { createMediaList } from "./media-list-state.js";
import { parseCSSRules } from "./css-parser.js";
import { CSSMediaRule } from "./css-media-rule-constructor.js";

const state = new WeakMap();

export function createCSSMediaRule(
  conditionText,
  body = "",
  parentStyleSheet = null,
  parentRule = null,
) {
  const rule = Object.create(CSSMediaRule.prototype);
  const media = createMediaList(conditionText);
  state.set(rule, { media });
  initializeCSSGroupingRule(rule, 4, parentStyleSheet, parentRule, {
    serialize: () => serializeCSSMediaRule(rule),
    setCssText: text => replaceCSSMediaRuleText(rule, text),
  });
  initializeCSSConditionRule(rule, () => media.mediaText);
  replaceCSSGroupingRules(rule, parseCSSRules(body, parentStyleSheet, rule));
  return rule;
}

export function requireCSSMediaRule(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  requireCSSGroupingRule(value);
  return record;
}

export function serializeCSSMediaRule(rule) {
  const record = requireCSSMediaRule(rule);
  const body = requireCSSGroupingRule(rule).rules.map(child => child.cssText).join(" ");
  return `@media ${record.media.mediaText} {${body === "" ? "" : ` ${body}`} }`;
}

export function replaceCSSMediaRuleText(rule, text) {
  const parsed = splitConditionalRule(text, "@media");
  const record = requireCSSMediaRule(rule);
  record.media.mediaText = parsed.condition;
  const parentStyleSheet = rule.parentStyleSheet;
  replaceCSSGroupingRules(rule, parseCSSRules(parsed.body, parentStyleSheet, rule));
}

function splitConditionalRule(text, keyword) {
  const source = `${text}`.trim();
  const open = source.indexOf("{");
  const close = source.lastIndexOf("}");
  if (!source.toLowerCase().startsWith(keyword) || open < keyword.length || close < open) {
    throw new DOMException("The rule could not be parsed.", "SyntaxError");
  }
  return {
    condition: source.slice(keyword.length, open).trim(),
    body: source.slice(open + 1, close),
  };
}

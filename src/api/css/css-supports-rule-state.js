import { initializeCSSConditionRule } from "./css-condition-rule-state.js";
import {
  initializeCSSGroupingRule,
  replaceCSSGroupingRules,
  requireCSSGroupingRule,
} from "./css-grouping-rule-state.js";
import { parseCSSRules } from "./css-parser.js";
import { CSSSupportsRule } from "./css-supports-rule-constructor.js";

const state = new WeakMap();

export function createCSSSupportsRule(
  conditionText,
  body = "",
  parentStyleSheet = null,
  parentRule = null,
) {
  const rule = Object.create(CSSSupportsRule.prototype);
  const record = { conditionText: `${conditionText}`.trim() };
  state.set(rule, record);
  initializeCSSGroupingRule(rule, 12, parentStyleSheet, parentRule, {
    serialize: () => serializeCSSSupportsRule(rule),
    setCssText: text => replaceCSSSupportsRuleText(rule, text),
  });
  initializeCSSConditionRule(rule, () => record.conditionText);
  replaceCSSGroupingRules(rule, parseCSSRules(body, parentStyleSheet, rule));
  return rule;
}

export function requireCSSSupportsRule(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  requireCSSGroupingRule(value);
  return record;
}

export function serializeCSSSupportsRule(rule) {
  const record = requireCSSSupportsRule(rule);
  const body = requireCSSGroupingRule(rule).rules.map(child => child.cssText).join(" ");
  return `@supports ${record.conditionText} {${body === "" ? "" : ` ${body}`} }`;
}

export function replaceCSSSupportsRuleText(rule, text) {
  const source = `${text}`.trim();
  const open = source.indexOf("{");
  const close = source.lastIndexOf("}");
  if (!source.toLowerCase().startsWith("@supports") || open < 9 || close < open) {
    throw new DOMException("The rule could not be parsed.", "SyntaxError");
  }
  requireCSSSupportsRule(rule).conditionText = source.slice(9, open).trim();
  replaceCSSGroupingRules(
    rule,
    parseCSSRules(source.slice(open + 1, close), rule.parentStyleSheet, rule),
  );
}

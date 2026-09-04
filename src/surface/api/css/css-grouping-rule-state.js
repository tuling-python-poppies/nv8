import { createCSSRuleList, refreshCSSRuleList } from "./css-rule-list-state.js";
import { initializeCSSRule, requireCSSRule } from "./css-rule-state.js";

const state = new WeakMap();

export function initializeCSSGroupingRule(
  rule,
  type,
  parentStyleSheet = null,
  parentRule = null,
  hooks = {},
) {
  const rules = [];
  const record = {
    rules,
    ruleList: createCSSRuleList(rules),
  };
  state.set(rule, record);
  initializeCSSRule(rule, type, "", parentStyleSheet, parentRule, hooks);
  return rule;
}

export function requireCSSGroupingRule(value) {
  requireCSSRule(value);
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

export function replaceCSSGroupingRules(rule, rules) {
  const record = requireCSSGroupingRule(rule);
  record.rules.splice(0, record.rules.length, ...rules);
  refreshCSSRuleList(record.ruleList);
}

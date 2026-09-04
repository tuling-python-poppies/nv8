import { requireCSSGroupingRule } from "./css-grouping-rule-state.js";
import { requireCSSRule } from "./css-rule-state.js";

const state = new WeakMap();

export function initializeCSSConditionRule(rule, getConditionText) {
  state.set(rule, { getConditionText });
  return rule;
}

export function requireCSSConditionRule(value) {
  requireCSSRule(value);
  requireCSSGroupingRule(value);
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

export function conditionTextFor(rule) {
  return `${requireCSSConditionRule(rule).getConditionText()}`;
}

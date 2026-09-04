import { CSSRule } from "./css-rule-constructor.js";

const state = new WeakMap();

export function createCSSRule(type, cssText, parentStyleSheet = null, parentRule = null) {
  const rule = Object.create(CSSRule.prototype);
  initializeCSSRule(rule, type, cssText, parentStyleSheet, parentRule);
  return rule;
}

export function initializeCSSRule(
  rule,
  type,
  cssText,
  parentStyleSheet = null,
  parentRule = null,
  hooks = {},
) {
  state.set(rule, {
    type: Number(type) >>> 0,
    cssText: `${cssText}`,
    parentStyleSheet,
    parentRule,
    ...hooks,
  });
  return rule;
}

export function requireCSSRule(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

export function setCSSRuleParents(rule, parentStyleSheet, parentRule = null) {
  const record = requireCSSRule(rule);
  record.parentStyleSheet = parentStyleSheet;
  record.parentRule = parentRule;
}

export function cssRuleText(rule) {
  const record = requireCSSRule(rule);
  return record.serialize === undefined ? record.cssText : record.serialize();
}

export function setCSSRuleText(rule, value) {
  const record = requireCSSRule(rule);
  if (record.setCssText === undefined) record.cssText = `${value}`;
  else record.setCssText(`${value}`);
}

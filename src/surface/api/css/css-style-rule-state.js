import { createCSSRuleList, refreshCSSRuleList } from "./css-rule-list-state.js";
import { initializeCSSRule, requireCSSRule } from "./css-rule-state.js";
import { createStyleMapForDeclaration, replaceDeclarationText } from "./css-declaration-style-map.js";
import { createCSSStyleDeclaration } from "./css-style-declaration-state.js";
import { CSSStyleRule } from "./css-style-rule-constructor.js";

const state = new WeakMap();

export function createCSSStyleRule(
  selector,
  declarationText = "",
  parentStyleSheet = null,
  parentRule = null,
) {
  const rule = Object.create(CSSStyleRule.prototype);
  const style = createCSSStyleDeclaration(null, declarationText, rule);
  const rules = [];
  const record = {
    selector: `${selector}`.trim(),
    style,
    styleMap: createStyleMapForDeclaration(style),
    rules,
    ruleList: createCSSRuleList(rules),
  };
  state.set(rule, record);
  initializeCSSRule(rule, 1, "", parentStyleSheet, parentRule, {
    serialize: () => serializeCSSStyleRule(rule),
    setCssText: text => replaceCSSStyleRuleText(rule, text),
  });
  return rule;
}

export function requireCSSStyleRule(value) {
  requireCSSRule(value);
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

function serializeCSSStyleRule(rule) {
  const record = requireCSSStyleRule(rule);
  const declarations = record.style.cssText;
  const nested = record.rules.map(child => child.cssText).join(" ");
  const body = [declarations, nested].filter(Boolean).join(" ");
  return `${record.selector} {${body === "" ? "" : ` ${body}`} }`;
}

function replaceCSSStyleRuleText(rule, text) {
  const source = `${text}`.trim();
  const open = source.indexOf("{");
  const close = source.lastIndexOf("}");
  if (open < 1 || close < open) return;
  const record = requireCSSStyleRule(rule);
  record.selector = source.slice(0, open).trim();
  replaceDeclarationText(record.style, source.slice(open + 1, close));
  record.rules.splice(0);
  refreshCSSRuleList(record.ruleList);
}

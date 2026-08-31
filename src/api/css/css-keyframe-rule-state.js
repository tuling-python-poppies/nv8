import { createCSSStyleDeclaration } from "./css-style-declaration-state.js";
import { CSSKeyframeRule } from "./css-keyframe-rule-constructor.js";
import { initializeCSSRule, requireCSSRule } from "./css-rule-state.js";
import { replaceDeclarationText } from "./css-declaration-style-map.js";

const state = new WeakMap();

export function createCSSKeyframeRule(
  keyText,
  declarationText = "",
  parentStyleSheet = null,
  parentRule = null,
) {
  const rule = Object.create(CSSKeyframeRule.prototype);
  const record = {
    keyText: normalizeKeyText(keyText),
    style: createCSSStyleDeclaration(null, declarationText, rule),
  };
  state.set(rule, record);
  initializeCSSRule(rule, 8, "", parentStyleSheet, parentRule, {
    serialize: () => serializeCSSKeyframeRule(rule),
    setCssText: text => replaceCSSKeyframeRuleText(rule, text),
  });
  return rule;
}

export function requireCSSKeyframeRule(value) {
  requireCSSRule(value);
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

export function serializeCSSKeyframeRule(rule) {
  const record = requireCSSKeyframeRule(rule);
  const declarations = record.style.cssText;
  return `${record.keyText} {${declarations === "" ? "" : ` ${declarations}`} }`;
}

export function replaceCSSKeyframeRuleText(rule, text) {
  const source = `${text}`.trim();
  const open = source.indexOf("{");
  const close = source.lastIndexOf("}");
  if (open < 1 || close < open) {
    throw new DOMException("The rule could not be parsed.", "SyntaxError");
  }
  const record = requireCSSKeyframeRule(rule);
  record.keyText = normalizeKeyText(source.slice(0, open));
  replaceDeclarationText(record.style, source.slice(open + 1, close));
}

export function normalizeKeyText(value) {
  const keys = `${value}`.split(",").map(key => key.trim()).filter(Boolean);
  if (keys.length === 0) {
    throw new DOMException("The keyframe selector is empty.", "SyntaxError");
  }
  return keys.join(", ");
}

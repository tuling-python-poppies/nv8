import { createCSSRule } from "./css-rule-state.js";
import { createCSSImportRule } from "./css-import-rule-state.js";
import { createCSSKeyframesRule } from "./css-keyframes-rule-state.js";
import {
  createCSSFontFaceRule,
  createCSSMarginRule,
  createCSSNamespaceRule,
  createCSSPositionTryRule,
  createCSSViewTransitionRule,
} from "./css-declaration-rule-state.js";
import {
  createCSSContainerRule,
  createCSSLayerBlockRule,
  createCSSLayerStatementRule,
  createCSSPageRule,
  createCSSScopeRule,
  createCSSStartingStyleRule,
} from "./css-grouping-special-state.js";
import {
  createCSSCounterStyleRule,
  createCSSFontFeatureValuesRule,
  createCSSFontPaletteValuesRule,
  createCSSPropertyRule,
} from "./css-descriptor-rule-state.js";
import { createCSSFunctionRule } from "./css-function-rule-state.js";
import { createCSSMediaRule } from "./css-media-rule-state.js";
import { createCSSStyleRule } from "./css-style-rule-state.js";
import { createCSSSupportsRule } from "./css-supports-rule-state.js";

export function parseCSSRules(text, parentStyleSheet = null, parentRule = null) {
  const rules = [];
  const source = `${text}`;
  let position = 0;
  while (position < source.length) {
    while (position < source.length && /[\s;]/u.test(source[position])) position += 1;
    if (position >= source.length) break;
    const open = source.indexOf("{", position);
    const semicolon = source.indexOf(";", position);
    if (semicolon >= 0 && (open < 0 || semicolon < open)) {
      const ruleText = source.slice(position, semicolon + 1).trim();
      if (ruleText !== "") rules.push(createGenericRule(ruleText, parentStyleSheet, parentRule));
      position = semicolon + 1;
      continue;
    }
    if (open < 0) break;
    const close = matchingBrace(source, open);
    if (close < 0) throw new DOMException("The rule could not be parsed.", "SyntaxError");
    const ruleText = source.slice(position, close + 1).trim();
    rules.push(parseSingleCSSRule(ruleText, parentStyleSheet, parentRule));
    position = close + 1;
  }
  return rules;
}

export function parseSingleCSSRule(text, parentStyleSheet = null, parentRule = null) {
  const source = `${text}`.trim();
  const open = source.indexOf("{");
  const close = source.lastIndexOf("}");
  if (open < 1 || close < open || source.slice(close + 1).trim() !== "") {
    throw new DOMException("The rule could not be parsed.", "SyntaxError");
  }
  const lower = source.toLowerCase();
  if (lower.startsWith("@media")) {
    return createCSSMediaRule(
      source.slice(6, open).trim(),
      source.slice(open + 1, close),
      parentStyleSheet,
      parentRule,
    );
  }
  if (lower.startsWith("@supports")) {
    return createCSSSupportsRule(
      source.slice(9, open).trim(),
      source.slice(open + 1, close),
      parentStyleSheet,
      parentRule,
    );
  }
  if (lower.startsWith("@font-face")) {
    return createCSSFontFaceRule(
      source.slice(open + 1, close),
      parentStyleSheet,
      parentRule,
    );
  }
  if (lower.startsWith("@property")) {
    return createCSSPropertyRule(
      source.slice(9, open).trim(),
      source.slice(open + 1, close),
      parentStyleSheet,
      parentRule,
    );
  }
  if (lower.startsWith("@font-palette-values")) {
    return createCSSFontPaletteValuesRule(
      source.slice(20, open).trim(),
      source.slice(open + 1, close),
      parentStyleSheet,
      parentRule,
    );
  }
  if (lower.startsWith("@counter-style")) {
    return createCSSCounterStyleRule(
      source.slice(14, open).trim(),
      source.slice(open + 1, close),
      parentStyleSheet,
      parentRule,
    );
  }
  if (lower.startsWith("@font-feature-values")) {
    return createCSSFontFeatureValuesRule(
      source.slice(20, open).trim(),
      source.slice(open + 1, close),
      parentStyleSheet,
      parentRule,
    );
  }
  if (lower.startsWith("@function")) {
    return createCSSFunctionRule(
      source.slice(9, open).trim(),
      source.slice(open + 1, close),
      parentStyleSheet,
      parentRule,
    );
  }
  if (lower.startsWith("@starting-style")) {
    return createCSSStartingStyleRule(
      source.slice(open + 1, close),
      parentStyleSheet,
      parentRule,
    );
  }
  if (lower.startsWith("@layer")) {
    return createCSSLayerBlockRule(
      source.slice(6, open).trim(),
      source.slice(open + 1, close),
      parentStyleSheet,
      parentRule,
    );
  }
  if (lower.startsWith("@scope")) {
    return createCSSScopeRule(
      source.slice(6, open).trim(),
      source.slice(open + 1, close),
      parentStyleSheet,
      parentRule,
    );
  }
  if (lower.startsWith("@page")) {
    return createCSSPageRule(
      source.slice(5, open).trim(),
      source.slice(open + 1, close),
      parentStyleSheet,
      parentRule,
    );
  }
  if (lower.startsWith("@container")) {
    return createCSSContainerRule(
      source.slice(10, open).trim(),
      source.slice(open + 1, close),
      parentStyleSheet,
      parentRule,
    );
  }
  if (lower.startsWith("@position-try")) {
    return createCSSPositionTryRule(
      source.slice(13, open).trim(),
      source.slice(open + 1, close),
      parentStyleSheet,
      parentRule,
    );
  }
  if (lower.startsWith("@view-transition")) {
    return createCSSViewTransitionRule(
      source.slice(open + 1, close),
      parentStyleSheet,
      parentRule,
    );
  }
  const margin = /^@(top|bottom)-(left|center|right)(?:-corner)?\b/iu.exec(source);
  if (margin !== null) {
    return createCSSMarginRule(
      source.slice(1, open).trim(),
      source.slice(open + 1, close),
      parentStyleSheet,
      parentRule,
    );
  }
  const keyframes = /^@(?:-webkit-)?keyframes\s+/iu.exec(source);
  if (keyframes !== null) {
    return createCSSKeyframesRule(
      source.slice(keyframes[0].length, open).trim(),
      source.slice(open + 1, close),
      parentStyleSheet,
      parentRule,
    );
  }
  if (source.startsWith("@")) return createGenericRule(source, parentStyleSheet, parentRule);
  const selector = source.slice(0, open).trim();
  if (selector === "") throw new DOMException("The selector is empty.", "SyntaxError");
  return createCSSStyleRule(
    selector,
    source.slice(open + 1, close).trim(),
    parentStyleSheet,
    parentRule,
  );
}

function createGenericRule(text, parentStyleSheet, parentRule) {
  const lower = text.toLowerCase();
  if (lower.startsWith("@import")) {
    return createCSSImportRule(text, parentStyleSheet, parentRule);
  }
  if (lower.startsWith("@namespace")) {
    return createCSSNamespaceRule(text, parentStyleSheet, parentRule);
  }
  if (lower.startsWith("@layer")) {
    return createCSSLayerStatementRule(text, parentStyleSheet, parentRule);
  }
  const type = lower.startsWith("@import") ? 3
    : lower.startsWith("@media") ? 4
    : lower.startsWith("@font-face") ? 5
    : lower.startsWith("@page") ? 6
    : lower.startsWith("@keyframes") || lower.startsWith("@-webkit-keyframes") ? 7
    : lower.startsWith("@namespace") ? 10
    : lower.startsWith("@counter-style") ? 11
    : lower.startsWith("@supports") ? 12
    : lower.startsWith("@font-feature-values") ? 14
    : 0;
  return createCSSRule(type, text, parentStyleSheet, parentRule);
}

function matchingBrace(source, open) {
  let depth = 0;
  let quote = "";
  for (let index = open; index < source.length; index += 1) {
    const character = source[index];
    if (quote !== "") {
      if (character === quote && source[index - 1] !== "\\") quote = "";
      continue;
    }
    if (character === "'" || character === '"') quote = character;
    else if (character === "{") depth += 1;
    else if (character === "}" && --depth === 0) return index;
  }
  return -1;
}

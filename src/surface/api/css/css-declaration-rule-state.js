import { CSSFontFaceRule, CSSMarginRule, CSSNamespaceRule, CSSPositionTryRule, CSSViewTransitionRule } from "./css-declaration-rule-constructors.js";
import { createCSSStyleDeclaration } from "./css-style-declaration-state.js";
import { initializeCSSRule, requireCSSRule } from "./css-rule-state.js";
import { replaceDeclarationText } from "./css-declaration-style-map.js";
import {
  createCSSPositionTryDescriptors,
} from "./css-position-try-descriptors.js";

const state = new WeakMap();

export function createCSSFontFaceRule(body, parentStyleSheet, parentRule) {
  return createDeclarationRule(
    CSSFontFaceRule,
    5,
    "@font-face",
    "",
    body,
    parentStyleSheet,
    parentRule,
  );
}

export function createCSSMarginRule(name, body, parentStyleSheet, parentRule) {
  return createDeclarationRule(
    CSSMarginRule,
    9,
    `@${`${name}`.replace(/^@/u, "")}`,
    "",
    body,
    parentStyleSheet,
    parentRule,
    { name: `${name}`.replace(/^@/u, "") },
  );
}

export function createCSSPositionTryRule(name, body, parentStyleSheet, parentRule) {
  return createDeclarationRule(
    CSSPositionTryRule,
    0,
    "@position-try",
    `${name}`.trim(),
    body,
    parentStyleSheet,
    parentRule,
    { name: `${name}`.trim() },
    createCSSPositionTryDescriptors,
  );
}

export function createCSSViewTransitionRule(body, parentStyleSheet, parentRule) {
  return createDeclarationRule(
    CSSViewTransitionRule,
    0,
    "@view-transition",
    "",
    body,
    parentStyleSheet,
    parentRule,
  );
}

export function createCSSNamespaceRule(text, parentStyleSheet, parentRule) {
  const source = `${text}`.trim().replace(/;?$/u, ";");
  const match = /^@namespace(?:\s+([-\w]+))?\s+(?:url\(\s*)?(?:"([^"]*)"|'([^']*)'|([^)\s;]+))\s*\)?\s*;$/iu.exec(source);
  if (match === null) throw new DOMException("The rule could not be parsed.", "SyntaxError");
  const rule = Object.create(CSSNamespaceRule.prototype);
  state.set(rule, {
    namespaceURI: match[2] ?? match[3] ?? match[4] ?? "",
    prefix: match[1] ?? "",
  });
  initializeCSSRule(rule, 10, source, parentStyleSheet, parentRule);
  return rule;
}

export function requireCSSDeclarationRule(value) {
  requireCSSRule(value);
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

function createDeclarationRule(
  constructor,
  type,
  keyword,
  header,
  body,
  parentStyleSheet,
  parentRule,
  extra = {},
  styleFactory = createCSSStyleDeclaration,
) {
  const rule = Object.create(constructor.prototype);
  const style = styleFactory === createCSSStyleDeclaration
    ? styleFactory(null, body, rule)
    : styleFactory(body, rule);
  const record = { keyword, header, style, ...extra };
  state.set(rule, record);
  initializeCSSRule(rule, type, "", parentStyleSheet, parentRule, {
    serialize: () => serializeDeclarationRule(rule),
    setCssText: text => replaceDeclarationRuleText(rule, text),
  });
  return rule;
}

function serializeDeclarationRule(rule) {
  const record = requireCSSDeclarationRule(rule);
  if (record.keyword === "") return record.style.cssText;
  const prelude = `${record.keyword}${record.header === "" ? "" : ` ${record.header}`}`;
  const declarations = record.style.cssText;
  return `${prelude} {${declarations === "" ? "" : ` ${declarations}`} }`;
}

function replaceDeclarationRuleText(rule, text) {
  const source = `${text}`.trim();
  const open = source.indexOf("{");
  const close = source.lastIndexOf("}");
  if (open < 0 || close < open) {
    throw new DOMException("The rule could not be parsed.", "SyntaxError");
  }
  const record = requireCSSDeclarationRule(rule);
  const prelude = source.slice(0, open).trim();
  if (record.keyword !== "" && !prelude.toLowerCase().startsWith(record.keyword)) {
    throw new DOMException("The rule could not be parsed.", "SyntaxError");
  }
  record.header = record.keyword === "" ? "" : prelude.slice(record.keyword.length).trim();
  if (record.name !== undefined) record.name = record.header || record.name;
  replaceDeclarationText(record.style, source.slice(open + 1, close));
}

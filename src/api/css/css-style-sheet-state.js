import { parseCSSRules } from "./css-parser.js";
import { createCSSRuleList, refreshCSSRuleList } from "./css-rule-list-state.js";
import { CSSStyleSheet } from "./css-style-sheet-constructor.js";
import { initializeStyleSheet } from "./style-sheet-state.js";

const state = new WeakMap();

export function initializeCSSStyleSheet(sheet, options = {}) {
  const normalized = options === null || typeof options !== "object" ? {} : options;
  initializeStyleSheet(sheet, {
    href: normalized.href ?? null,
    ownerNode: normalized.ownerNode ?? null,
    parentStyleSheet: normalized.parentStyleSheet ?? null,
    title: normalized.title ?? null,
    media: normalized.media ?? "",
    disabled: normalized.disabled ?? false,
  });
  const rules = [];
  const record = {
    ownerRule: normalized.ownerRule ?? null,
    rules,
    ruleList: createCSSRuleList(rules),
  };
  state.set(sheet, record);
  if (normalized.text !== undefined && `${normalized.text}` !== "") {
    replaceCSSStyleSheetRules(sheet, normalized.text);
  }
  return sheet;
}

export function createCSSStyleSheet(options = {}) {
  const sheet = Object.create(CSSStyleSheet.prototype);
  return initializeCSSStyleSheet(sheet, options);
}

export function requireCSSStyleSheet(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

export function replaceCSSStyleSheetRules(sheet, text) {
  const record = requireCSSStyleSheet(sheet);
  const rules = parseCSSRules(text, sheet, null);
  record.rules.splice(0, record.rules.length, ...rules);
  refreshCSSRuleList(record.ruleList);
}

export function insertCSSStyleSheetRule(sheet, text, index = 0) {
  const record = requireCSSStyleSheet(sheet);
  const normalized = Number(index) >>> 0;
  if (normalized > record.rules.length) {
    throw new DOMException("The index is not in the allowed range.", "IndexSizeError");
  }
  const rules = parseCSSRules(text, sheet, null);
  if (rules.length !== 1) throw new DOMException("Exactly one rule is required.", "SyntaxError");
  record.rules.splice(normalized, 0, rules[0]);
  refreshCSSRuleList(record.ruleList);
  return normalized;
}

export function deleteCSSStyleSheetRule(sheet, index) {
  const record = requireCSSStyleSheet(sheet);
  const normalized = Number(index) >>> 0;
  if (normalized >= record.rules.length) {
    throw new DOMException("The index is not in the allowed range.", "IndexSizeError");
  }
  record.rules.splice(normalized, 1);
  refreshCSSRuleList(record.ruleList);
}

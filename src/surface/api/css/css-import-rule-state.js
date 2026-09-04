import { createCSSStyleSheet } from "./css-style-sheet-state.js";
import { CSSImportRule } from "./css-import-rule-constructor.js";
import { initializeCSSRule, requireCSSRule } from "./css-rule-state.js";
import { createMediaList } from "./media-list-state.js";

const state = new WeakMap();

export function createCSSImportRule(text, parentStyleSheet = null, parentRule = null) {
  const parsed = parseImportRule(text);
  const rule = Object.create(CSSImportRule.prototype);
  initializeCSSRule(rule, 3, parsed.cssText, parentStyleSheet, parentRule);
  const media = createMediaList(parsed.mediaText);
  const styleSheet = createCSSStyleSheet({
    href: parsed.href,
    parentStyleSheet,
    ownerRule: rule,
    media,
  });
  state.set(rule, {
    href: parsed.href,
    media,
    styleSheet,
    layerName: parsed.layerName,
    supportsText: parsed.supportsText,
  });
  return rule;
}

export function requireCSSImportRule(value) {
  requireCSSRule(value);
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

function parseImportRule(text) {
  const source = `${text}`.trim().replace(/;?$/u, ";");
  const match = /^@import\s+(?:url\(\s*(?:"([^"]*)"|'([^']*)'|([^)\s]+))\s*\)|"([^"]*)"|'([^']*)')\s*([\s\S]*?);$/iu.exec(source);
  if (match === null) throw new DOMException("The rule could not be parsed.", "SyntaxError");
  const href = match[1] ?? match[2] ?? match[3] ?? match[4] ?? match[5] ?? "";
  let remainder = match[6].trim();
  let layerName = null;
  let supportsText = null;
  const layer = /\blayer(?:\(\s*([^)]*?)\s*\))?/iu.exec(remainder);
  if (layer !== null) {
    layerName = layer[1] === undefined ? "" : layer[1];
    remainder = `${remainder.slice(0, layer.index)} ${remainder.slice(layer.index + layer[0].length)}`.trim();
  }
  const supports = /\bsupports\(\s*([^)]*?)\s*\)/iu.exec(remainder);
  if (supports !== null) {
    supportsText = supports[1];
    remainder = `${remainder.slice(0, supports.index)} ${remainder.slice(supports.index + supports[0].length)}`.trim();
  }
  return {
    href,
    mediaText: remainder,
    layerName,
    supportsText,
    cssText: source,
  };
}

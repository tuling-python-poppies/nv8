import { createCSSKeyframeRule, normalizeKeyText } from "./css-keyframe-rule-state.js";
import { createCSSRuleList, refreshCSSRuleList } from "./css-rule-list-state.js";
import { CSSKeyframesRule } from "./css-keyframes-rule-constructor.js";
import { initializeCSSRule, requireCSSRule } from "./css-rule-state.js";

const state = new WeakMap();

export function createCSSKeyframesRule(
  name,
  body = "",
  parentStyleSheet = null,
  parentRule = null,
) {
  const rule = Object.create(CSSKeyframesRule.prototype);
  const rules = [];
  const record = {
    name: `${name}`.trim(),
    rules,
    ruleList: createCSSRuleList(rules),
  };
  state.set(rule, record);
  initializeCSSRule(rule, 7, "", parentStyleSheet, parentRule, {
    serialize: () => serializeCSSKeyframesRule(rule),
    setCssText: text => replaceCSSKeyframesRuleText(rule, text),
  });
  replaceCSSKeyframesBody(rule, body);
  return rule;
}

export function requireCSSKeyframesRule(value) {
  requireCSSRule(value);
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

export function appendCSSKeyframeRule(rule, text) {
  const record = requireCSSKeyframesRule(rule);
  record.rules.push(parseCSSKeyframeRule(text, rule.parentStyleSheet, rule));
  refreshCSSRuleList(record.ruleList);
}

export function findCSSKeyframeRule(rule, key) {
  const wanted = normalizeKeyText(key).toLowerCase();
  const rules = requireCSSKeyframesRule(rule).rules;
  for (let index = rules.length - 1; index >= 0; index -= 1) {
    if (rules[index].keyText.toLowerCase() === wanted) return rules[index];
  }
  return null;
}

export function deleteCSSKeyframeRule(rule, key) {
  const record = requireCSSKeyframesRule(rule);
  const found = findCSSKeyframeRule(rule, key);
  if (found === null) return;
  record.rules.splice(record.rules.lastIndexOf(found), 1);
  refreshCSSRuleList(record.ruleList);
}

export function serializeCSSKeyframesRule(rule) {
  const record = requireCSSKeyframesRule(rule);
  const body = record.rules.map(child => child.cssText).join(" ");
  return `@keyframes ${record.name} {${body === "" ? "" : ` ${body}`} }`;
}

export function replaceCSSKeyframesRuleText(rule, text) {
  const source = `${text}`.trim();
  const open = source.indexOf("{");
  const close = source.lastIndexOf("}");
  const match = /^@(?:-webkit-)?keyframes\s+/iu.exec(source);
  if (match === null || open < match[0].length || close < open) {
    throw new DOMException("The rule could not be parsed.", "SyntaxError");
  }
  requireCSSKeyframesRule(rule).name = source.slice(match[0].length, open).trim();
  replaceCSSKeyframesBody(rule, source.slice(open + 1, close));
}

function replaceCSSKeyframesBody(rule, body) {
  const record = requireCSSKeyframesRule(rule);
  const rules = parseCSSKeyframeRules(body, rule.parentStyleSheet, rule);
  record.rules.splice(0, record.rules.length, ...rules);
  refreshCSSRuleList(record.ruleList);
}

function parseCSSKeyframeRules(text, parentStyleSheet, parentRule) {
  const source = `${text}`;
  const rules = [];
  let position = 0;
  while (position < source.length) {
    while (position < source.length && /[\s;]/u.test(source[position])) position += 1;
    if (position >= source.length) break;
    const open = source.indexOf("{", position);
    if (open < 1) throw new DOMException("The rule could not be parsed.", "SyntaxError");
    const close = matchingBrace(source, open);
    if (close < 0) throw new DOMException("The rule could not be parsed.", "SyntaxError");
    rules.push(createCSSKeyframeRule(
      source.slice(position, open),
      source.slice(open + 1, close),
      parentStyleSheet,
      parentRule,
    ));
    position = close + 1;
  }
  return rules;
}

function parseCSSKeyframeRule(text, parentStyleSheet, parentRule) {
  const source = `${text}`.trim();
  const open = source.indexOf("{");
  const close = source.lastIndexOf("}");
  if (open < 1 || close < open || source.slice(close + 1).trim() !== "") {
    throw new DOMException("The rule could not be parsed.", "SyntaxError");
  }
  return createCSSKeyframeRule(
    source.slice(0, open),
    source.slice(open + 1, close),
    parentStyleSheet,
    parentRule,
  );
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

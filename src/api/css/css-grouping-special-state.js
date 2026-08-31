import { initializeCSSConditionRule } from "./css-condition-rule-state.js";
import {
  initializeCSSGroupingRule,
  replaceCSSGroupingRules,
  requireCSSGroupingRule,
} from "./css-grouping-rule-state.js";
import {
  CSSContainerRule,
  CSSLayerBlockRule,
  CSSLayerStatementRule,
  CSSPageRule,
  CSSScopeRule,
  CSSStartingStyleRule,
} from "./css-grouping-special-constructors.js";
import { parseCSSRules, parseSingleCSSRule } from "./css-parser.js";
import { createCSSStyleDeclaration } from "./css-style-declaration-state.js";
import { initializeCSSRule, requireCSSRule } from "./css-rule-state.js";
import { replaceDeclarationText } from "./css-declaration-style-map.js";

const state = new WeakMap();

export function createCSSStartingStyleRule(body, parentStyleSheet, parentRule) {
  return createGrouping(
    CSSStartingStyleRule,
    0,
    { kind: "starting" },
    body,
    parentStyleSheet,
    parentRule,
  );
}

export function createCSSLayerBlockRule(name, body, parentStyleSheet, parentRule) {
  return createGrouping(
    CSSLayerBlockRule,
    0,
    { kind: "layer-block", name: `${name}`.trim() },
    body,
    parentStyleSheet,
    parentRule,
  );
}

export function createCSSLayerStatementRule(text, parentStyleSheet, parentRule) {
  const source = `${text}`.trim().replace(/;?$/u, ";");
  const match = /^@layer\s+([^;]+);$/iu.exec(source);
  if (match === null) throw new DOMException("The rule could not be parsed.", "SyntaxError");
  const rule = Object.create(CSSLayerStatementRule.prototype);
  const nameList = match[1].split(",").map(name => name.trim()).filter(Boolean);
  state.set(rule, { kind: "layer-statement", nameList });
  initializeCSSRule(rule, 0, source, parentStyleSheet, parentRule);
  return rule;
}

export function createCSSScopeRule(prelude, body, parentStyleSheet, parentRule) {
  const parsed = parseScopePrelude(prelude);
  return createGrouping(
    CSSScopeRule,
    0,
    { kind: "scope", ...parsed },
    body,
    parentStyleSheet,
    parentRule,
  );
}

export function createCSSPageRule(selectorText, body, parentStyleSheet, parentRule) {
  const rule = Object.create(CSSPageRule.prototype);
  const style = createCSSStyleDeclaration(null, "", rule);
  const record = {
    kind: "page",
    selectorText: `${selectorText}`.trim(),
    style,
  };
  state.set(rule, record);
  initializeCSSGroupingRule(rule, 6, parentStyleSheet, parentRule, {
    serialize: () => serializeSpecialGroupingRule(rule),
    setCssText: text => replaceSpecialGroupingRuleText(rule, text),
  });
  replacePageBody(rule, body);
  return rule;
}

export function createCSSContainerRule(prelude, body, parentStyleSheet, parentRule) {
  const parsed = parseContainerPrelude(prelude);
  const rule = createGrouping(
    CSSContainerRule,
    0,
    { kind: "container", ...parsed },
    body,
    parentStyleSheet,
    parentRule,
  );
  initializeCSSConditionRule(rule, () => requireCSSGroupingSpecialRule(rule).containerQuery);
  return rule;
}

export function requireCSSGroupingSpecialRule(value) {
  requireCSSRule(value);
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

export function serializeSpecialGroupingRule(rule) {
  const record = requireCSSGroupingSpecialRule(rule);
  if (record.kind === "layer-statement") return rule.cssText;
  const children = requireCSSGroupingRule(rule).rules.map(child => child.cssText);
  if (record.kind === "page" && record.style.cssText !== "") {
    children.unshift(record.style.cssText);
  }
  const body = children.join(" ");
  const prelude = record.kind === "starting" ? "@starting-style"
    : record.kind === "layer-block" ? `@layer${record.name === "" ? "" : ` ${record.name}`}`
    : record.kind === "scope" ? `@scope${scopePrelude(record)}`
    : record.kind === "page" ? `@page${record.selectorText === "" ? "" : ` ${record.selectorText}`}`
    : `@container${containerPrelude(record) === "" ? "" : ` ${containerPrelude(record)}`}`;
  return `${prelude} {${body === "" ? "" : ` ${body}`} }`;
}

export function replaceSpecialGroupingRuleText(rule, text) {
  const source = `${text}`.trim();
  const open = source.indexOf("{");
  const close = source.lastIndexOf("}");
  if (open < 0 || close < open) {
    throw new DOMException("The rule could not be parsed.", "SyntaxError");
  }
  const record = requireCSSGroupingSpecialRule(rule);
  const header = source.slice(0, open).trim();
  const body = source.slice(open + 1, close);
  if (record.kind === "starting") replaceGroupBody(rule, body);
  else if (record.kind === "layer-block") {
    record.name = header.slice(6).trim();
    replaceGroupBody(rule, body);
  } else if (record.kind === "scope") {
    Object.assign(record, parseScopePrelude(header.slice(6)));
    replaceGroupBody(rule, body);
  } else if (record.kind === "page") {
    record.selectorText = header.slice(5).trim();
    replacePageBody(rule, body);
  } else if (record.kind === "container") {
    Object.assign(record, parseContainerPrelude(header.slice(10)));
    replaceGroupBody(rule, body);
  }
}

function createGrouping(
  constructor,
  type,
  record,
  body,
  parentStyleSheet,
  parentRule,
) {
  const rule = Object.create(constructor.prototype);
  state.set(rule, record);
  initializeCSSGroupingRule(rule, type, parentStyleSheet, parentRule, {
    serialize: () => serializeSpecialGroupingRule(rule),
    setCssText: text => replaceSpecialGroupingRuleText(rule, text),
  });
  replaceGroupBody(rule, body);
  return rule;
}

function replaceGroupBody(rule, body) {
  replaceCSSGroupingRules(
    rule,
    parseCSSRules(body, rule.parentStyleSheet, rule),
  );
}

function replacePageBody(rule, body) {
  const { declarations, rules } = splitPageBody(body);
  const record = requireCSSGroupingSpecialRule(rule);
  replaceDeclarationText(record.style, declarations);
  replaceCSSGroupingRules(
    rule,
    rules.map(text => parseSingleCSSRule(text, rule.parentStyleSheet, rule)),
  );
}

function splitPageBody(text) {
  const source = `${text}`;
  const declarations = [];
  const rules = [];
  let position = 0;
  while (position < source.length) {
    while (position < source.length && /\s/u.test(source[position])) position += 1;
    if (position >= source.length) break;
    if (source[position] === "@") {
      const open = source.indexOf("{", position);
      if (open < 0) break;
      const close = matchingBrace(source, open);
      if (close < 0) throw new DOMException("The rule could not be parsed.", "SyntaxError");
      rules.push(source.slice(position, close + 1));
      position = close + 1;
    } else {
      const semicolon = source.indexOf(";", position);
      if (semicolon < 0) {
        declarations.push(source.slice(position));
        break;
      }
      declarations.push(source.slice(position, semicolon + 1));
      position = semicolon + 1;
    }
  }
  return { declarations: declarations.join(" "), rules };
}

function parseScopePrelude(value) {
  const source = `${value}`.trim();
  const match = /^(\([^]*?\))?(?:\s+to\s+(\([^]*\)))?$/iu.exec(source);
  return {
    start: match?.[1] ?? null,
    end: match?.[2] ?? null,
  };
}

function scopePrelude(record) {
  if (record.start === null && record.end === null) return "";
  return ` ${record.start ?? ""}${record.end === null ? "" : ` to ${record.end}`}`.trimEnd();
}

function parseContainerPrelude(value) {
  const source = `${value}`.trim();
  if (source.startsWith("(") || source.toLowerCase().startsWith("style(")) {
    return { containerName: "", containerQuery: source, conditions: [source] };
  }
  const space = source.search(/\s/u);
  const containerName = space < 0 ? source : source.slice(0, space);
  const containerQuery = space < 0 ? "" : source.slice(space).trim();
  return {
    containerName,
    containerQuery,
    conditions: containerQuery === "" ? [] : [containerQuery],
  };
}

function containerPrelude(record) {
  return [record.containerName, record.containerQuery].filter(Boolean).join(" ");
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

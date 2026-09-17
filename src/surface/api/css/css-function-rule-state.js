import {
  CSSFunctionDeclarations,
  CSSFunctionDescriptors,
  CSSFunctionRule,
} from "./css-function-rule-constructors.js";
import {
  initializeCSSGroupingRule,
  replaceCSSGroupingRules,
  requireCSSGroupingRule,
} from "./css-grouping-rule-state.js";
import { initializeCSSStyleDeclaration } from "./css-style-declaration-state.js";
import { initializeCSSRule, requireCSSRule } from "./css-rule-state.js";

const functionState = new WeakMap();
const declarationsState = new WeakMap();

export function createCSSFunctionRule(prelude, body, parentStyleSheet, parentRule) {
  const parsed = parseFunctionPrelude(prelude);
  const rule = Object.create(CSSFunctionRule.prototype);
  functionState.set(rule, parsed);
  initializeCSSGroupingRule(rule, 0, parentStyleSheet, parentRule, {
    serialize: () => serializeCSSFunctionRule(rule),
    setCssText: text => replaceCSSFunctionRuleText(rule, text),
  });
  replaceFunctionBody(rule, body);
  return rule;
}

export function requireCSSFunctionRule(value) {
  requireCSSGroupingRule(value);
  const record = functionState.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

export function requireCSSFunctionDeclarations(value) {
  requireCSSRule(value);
  const record = declarationsState.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

function createCSSFunctionDescriptors(text, parentRule) {
  const style = Object.create(CSSFunctionDescriptors.prototype);
  return initializeCSSStyleDeclaration(style, null, text, parentRule);
}

function createCSSFunctionDeclarations(text, parentStyleSheet, parentRule) {
  const rule = Object.create(CSSFunctionDeclarations.prototype);
  const style = createCSSFunctionDescriptors(text, rule);
  declarationsState.set(rule, { style });
  initializeCSSRule(rule, 0, "", parentStyleSheet, parentRule, {
    serialize: () => style.cssText,
  });
  return rule;
}

function replaceFunctionBody(rule, body) {
  replaceCSSGroupingRules(rule, [
    createCSSFunctionDeclarations(body, rule.parentStyleSheet, rule),
  ]);
}

function serializeCSSFunctionRule(rule) {
  const record = requireCSSFunctionRule(rule);
  const body = requireCSSGroupingRule(rule).rules.map(child => child.cssText).join(" ");
  const parameters = record.parameters.join(", ");
  const returns = record.returnType === "" ? "" : ` returns ${record.returnType}`;
  return `@function ${record.name}(${parameters})${returns} {${body === "" ? "" : ` ${body}`} }`;
}

function replaceCSSFunctionRuleText(rule, text) {
  const source = `${text}`.trim();
  const open = source.indexOf("{");
  const close = source.lastIndexOf("}");
  if (!source.toLowerCase().startsWith("@function") || open < 0 || close < open) {
    throw new DOMException("The rule could not be parsed.", "SyntaxError");
  }
  Object.assign(requireCSSFunctionRule(rule), parseFunctionPrelude(source.slice(9, open)));
  replaceFunctionBody(rule, source.slice(open + 1, close));
}

function parseFunctionPrelude(value) {
  const source = `${value}`.trim();
  const match = /^([-\w]+)\s*\(([^)]*)\)\s*(?:returns\s+(.+))?$/iu.exec(source);
  if (match === null) throw new DOMException("The rule could not be parsed.", "SyntaxError");
  return {
    name: match[1],
    parameters: match[2].split(",").map(parameter => parameter.trim()).filter(Boolean),
    returnType: match[3]?.trim() ?? "",
  };
}

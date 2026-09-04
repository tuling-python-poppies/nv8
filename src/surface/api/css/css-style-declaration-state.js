import { getAttributeValue, removeAttributeValue, setAttributeValue } from "../dom/element-state.js";
import { CSSStyleDeclaration } from "./css-style-declaration-constructor.js";
import { installCSSPropertyAccessors } from "./css-style-declaration-properties.js";

const state = new WeakMap();

export function createCSSStyleDeclaration(
  element = null,
  initialText = "",
  parentRule = null,
  readonly = false,
) {
  const declaration = Object.create(CSSStyleDeclaration.prototype);
  initializeCSSStyleDeclaration(declaration, element, initialText, parentRule);
  // CSS 属性访问器装在**实例**上：真实 Edge 的
  // `CSSStyleDeclaration.prototype` 只有 10 个成员，745 个属性全是自有属性。
  // 未设置的属性因此读作 `""` 而不是 `undefined`。
  installCSSPropertyAccessors(declaration, readonly);
  return declaration;
}

export function initializeCSSStyleDeclaration(
  declaration,
  element = null,
  initialText = "",
  parentRule = null,
) {
  state.set(declaration, { element, text: `${initialText}`, parentRule });
  return declaration;
}

export function requireCSSStyleDeclaration(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

export function readCSSDeclarations(value) {
  const record = requireCSSStyleDeclaration(value);
  const text = record.element === null
    ? record.text
    : getAttributeValue(record.element, "style") ?? "";
  return parseCSSDeclarations(text);
}

export function writeCSSDeclarations(value, declarations) {
  const record = requireCSSStyleDeclaration(value);
  const text = serializeCSSDeclarations(declarations);
  record.text = text;
  if (record.element !== null) {
    if (text === "") removeAttributeValue(record.element, "style");
    else setAttributeValue(record.element, "style", text);
  }
}

export function parseCSSDeclarations(text) {
  const declarations = new Map();
  for (const source of `${text}`.split(";")) {
    const separator = source.indexOf(":");
    if (separator < 0) continue;
    const name = normalizeCSSPropertyName(source.slice(0, separator));
    if (name === "") continue;
    let value = source.slice(separator + 1).trim();
    let priority = "";
    const important = /\s*!important\s*$/iu.exec(value);
    if (important !== null) {
      value = value.slice(0, important.index).trim();
      priority = "important";
    }
    if (value !== "") declarations.set(name, { value, priority });
  }
  return declarations;
}

export function serializeCSSDeclarations(declarations) {
  return [...declarations].map(([name, declaration]) =>
    `${name}: ${declaration.value}${declaration.priority === "important" ? " !important" : ""};`
  ).join(" ");
}

export function normalizeCSSPropertyName(name) {
  const value = `${name}`.trim();
  return value.startsWith("--") ? value : value.toLowerCase();
}

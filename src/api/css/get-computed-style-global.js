import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireElement, getAttributeValue } from "../dom/element-state.js";
import { createCSSStyleDeclaration, readCSSDeclarations } from "./css-style-declaration-state.js";
import { computedValueFor, isAttachedForStyle } from "./css-computed-value.js";
import { MODELED_PROPERTIES } from "./css-ua-defaults.js";

export function getComputedStyle(element) {
  if (arguments.length < 1) {
    throw new TypeError("Failed to execute 'getComputedStyle' on 'Window': 1 argument required, but only 0 present.");
  }
  requireElement(element);

  // computed style 是**只读**的：真实 Edge 对赋值抛
  // `NoModificationAllowedError: ... These styles are computed, and therefore
  //  the 'color' property is read-only.`
  // 迁移前静默接受赋值。
  const result = createCSSStyleDeclaration(
    null,
    getAttributeValue(element, "style") ?? "",
    null,
    true,
  );

  // 游离元素的计算值全为空串（实测真实 Edge）。挂载后才做 UA 默认样式表解析。
  if (!isAttachedForStyle(element)) {
    traceCall("window.getComputedStyle", "Window", [...arguments], result);
    return result;
  }

  const declarations = readCSSDeclarations(result);
  const localName = `${element.localName ?? ""}`.toLowerCase();
  for (const property of MODELED_PROPERTIES) {
    const kebab = property.replace(/[A-Z]/gu, letter => `-${letter.toLowerCase()}`);
    const value = computedValueFor(localName, property, declarations, kebab);
    if (value !== "") expose(result, property, value);
  }
  // 内联声明里出现的属性即使未建模也要回显，并保留 kebab-case 别名
  for (const [name, declaration] of declarations) {
    expose(result, name, declaration.value);
    const camel = name.replace(/-([a-z])/gu, (_match, letter) => letter.toUpperCase());
    if (camel !== name) expose(result, camel, declaration.value);
  }
  traceCall("window.getComputedStyle", "Window", [...arguments], result);
  return result;
}
registerNativeFunction(getComputedStyle, "getComputedStyle");

function expose(style, name, value) {
  // 已被前面的建模值占位时不再覆盖：建模值已经做过颜色序列化。
  const existing = Object.getOwnPropertyDescriptor(style, name);
  if (existing !== undefined && existing.get === undefined) return;
  Object.defineProperty(style, name, {
    value,
    writable: false,
    enumerable: true,
    configurable: true,
  });
}

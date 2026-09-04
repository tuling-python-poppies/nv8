import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { CSSRule } from "./css-rule-constructor.js";
import { CSSStyleValue } from "./css-style-value-constructor.js";

export function CSSFontFaceRule() { throw new TypeError("Illegal constructor"); }
export function CSSMarginRule() { throw new TypeError("Illegal constructor"); }
export function CSSNestedDeclarations() { throw new TypeError("Illegal constructor"); }
export function CSSNamespaceRule() { throw new TypeError("Illegal constructor"); }
export function CSSPositionTryRule() { throw new TypeError("Illegal constructor"); }
export function CSSViewTransitionRule() { throw new TypeError("Illegal constructor"); }
export function CSSImageValue() { throw new TypeError("Illegal constructor"); }

for (const constructor of [
  CSSFontFaceRule,
  CSSMarginRule,
  CSSNestedDeclarations,
  CSSNamespaceRule,
  CSSPositionTryRule,
  CSSViewTransitionRule,
  CSSImageValue,
]) {
  registerNativeFunction(constructor, constructor.name);
}

export function installCSSDeclarationRuleConstructors() {
  for (const constructor of [
    CSSFontFaceRule,
    CSSMarginRule,
    CSSNestedDeclarations,
    CSSNamespaceRule,
    CSSPositionTryRule,
    CSSViewTransitionRule,
  ]) {
    inherit(constructor, CSSRule);
  }
  inherit(CSSImageValue, CSSStyleValue);
  for (const constructor of [
    CSSFontFaceRule,
    CSSMarginRule,
    CSSNestedDeclarations,
    CSSNamespaceRule,
    CSSPositionTryRule,
    CSSViewTransitionRule,
    CSSImageValue,
  ]) {
    delete constructor.prototype.constructor;
    defineGlobalConstructor(constructor.name, constructor);
  }
}

function inherit(constructor, parent) {
  Object.setPrototypeOf(constructor.prototype, parent.prototype);
  Object.setPrototypeOf(constructor, parent);
}

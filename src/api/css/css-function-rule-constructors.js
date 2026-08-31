import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { CSSGroupingRule } from "./css-grouping-rule-constructor.js";
import { CSSRule } from "./css-rule-constructor.js";
import { CSSStyleDeclaration } from "./css-style-declaration-constructor.js";

export function CSSFunctionDeclarations() { throw new TypeError("Illegal constructor"); }
export function CSSFunctionDescriptors() { throw new TypeError("Illegal constructor"); }
export function CSSFunctionRule() { throw new TypeError("Illegal constructor"); }

for (const constructor of [
  CSSFunctionDeclarations,
  CSSFunctionDescriptors,
  CSSFunctionRule,
]) {
  registerNativeFunction(constructor, constructor.name);
}

export function installCSSFunctionRuleConstructors() {
  inherit(CSSFunctionDeclarations, CSSRule);
  inherit(CSSFunctionDescriptors, CSSStyleDeclaration);
  inherit(CSSFunctionRule, CSSGroupingRule);
  for (const constructor of [
    CSSFunctionDeclarations,
    CSSFunctionDescriptors,
    CSSFunctionRule,
  ]) {
    delete constructor.prototype.constructor;
    defineGlobalConstructor(constructor.name, constructor);
  }
}

function inherit(constructor, parent) {
  Object.setPrototypeOf(constructor.prototype, parent.prototype);
  Object.setPrototypeOf(constructor, parent);
}

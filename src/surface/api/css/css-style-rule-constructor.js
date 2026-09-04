import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { CSSRule } from "./css-rule-constructor.js";

export function CSSStyleRule() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(CSSStyleRule, "CSSStyleRule");

export function installCSSStyleRuleConstructor() {
  Object.setPrototypeOf(CSSStyleRule.prototype, CSSRule.prototype);
  Object.setPrototypeOf(CSSStyleRule, CSSRule);
  delete CSSStyleRule.prototype.constructor;
  defineGlobalConstructor("CSSStyleRule", CSSStyleRule);
}

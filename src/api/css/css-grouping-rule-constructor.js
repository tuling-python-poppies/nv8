import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { CSSRule } from "./css-rule-constructor.js";

export function CSSGroupingRule() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(CSSGroupingRule, "CSSGroupingRule");

export function installCSSGroupingRuleConstructor() {
  Object.setPrototypeOf(CSSGroupingRule.prototype, CSSRule.prototype);
  Object.setPrototypeOf(CSSGroupingRule, CSSRule);
  delete CSSGroupingRule.prototype.constructor;
  defineGlobalConstructor("CSSGroupingRule", CSSGroupingRule);
}

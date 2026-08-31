import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { CSSRule } from "./css-rule-constructor.js";

export function CSSKeyframesRule() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(CSSKeyframesRule, "CSSKeyframesRule");

export function installCSSKeyframesRuleConstructor() {
  Object.setPrototypeOf(CSSKeyframesRule.prototype, CSSRule.prototype);
  Object.setPrototypeOf(CSSKeyframesRule, CSSRule);
  delete CSSKeyframesRule.prototype.constructor;
  defineGlobalConstructor("CSSKeyframesRule", CSSKeyframesRule);
}

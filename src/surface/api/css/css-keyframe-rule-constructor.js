import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { CSSRule } from "./css-rule-constructor.js";

export function CSSKeyframeRule() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(CSSKeyframeRule, "CSSKeyframeRule");

export function installCSSKeyframeRuleConstructor() {
  Object.setPrototypeOf(CSSKeyframeRule.prototype, CSSRule.prototype);
  Object.setPrototypeOf(CSSKeyframeRule, CSSRule);
  delete CSSKeyframeRule.prototype.constructor;
  defineGlobalConstructor("CSSKeyframeRule", CSSKeyframeRule);
}

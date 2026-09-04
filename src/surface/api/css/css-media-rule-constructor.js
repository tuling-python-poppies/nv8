import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { CSSConditionRule } from "./css-condition-rule-constructor.js";

export function CSSMediaRule() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(CSSMediaRule, "CSSMediaRule");

export function installCSSMediaRuleConstructor() {
  Object.setPrototypeOf(CSSMediaRule.prototype, CSSConditionRule.prototype);
  Object.setPrototypeOf(CSSMediaRule, CSSConditionRule);
  delete CSSMediaRule.prototype.constructor;
  defineGlobalConstructor("CSSMediaRule", CSSMediaRule);
}

import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { CSSConditionRule } from "./css-condition-rule-constructor.js";

export function CSSSupportsRule() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(CSSSupportsRule, "CSSSupportsRule");

export function installCSSSupportsRuleConstructor() {
  Object.setPrototypeOf(CSSSupportsRule.prototype, CSSConditionRule.prototype);
  Object.setPrototypeOf(CSSSupportsRule, CSSConditionRule);
  delete CSSSupportsRule.prototype.constructor;
  defineGlobalConstructor("CSSSupportsRule", CSSSupportsRule);
}

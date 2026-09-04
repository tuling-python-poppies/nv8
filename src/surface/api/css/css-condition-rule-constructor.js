import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { CSSGroupingRule } from "./css-grouping-rule-constructor.js";

export function CSSConditionRule() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(CSSConditionRule, "CSSConditionRule");

export function installCSSConditionRuleConstructor() {
  Object.setPrototypeOf(CSSConditionRule.prototype, CSSGroupingRule.prototype);
  Object.setPrototypeOf(CSSConditionRule, CSSGroupingRule);
  delete CSSConditionRule.prototype.constructor;
  defineGlobalConstructor("CSSConditionRule", CSSConditionRule);
}

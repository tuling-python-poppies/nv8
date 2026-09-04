import {
  defineConstructorBacklink,
  definePrototypeGetter,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  CSSConditionRule,
  installCSSConditionRuleConstructor,
} from "../api/css/css-condition-rule-constructor.js";
import {
  conditionText,
} from "../api/css/css-condition-rule-condition-text-getter.js";

export function installCSSConditionRule() {
  installCSSConditionRuleConstructor();
  definePrototypeGetter(CSSConditionRule.prototype, "conditionText", conditionText);
  defineConstructorBacklink(CSSConditionRule.prototype, CSSConditionRule);
  defineToStringTag(CSSConditionRule.prototype, "CSSConditionRule");
}

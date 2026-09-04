import {
  defineConstructorBacklink,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  CSSSupportsRule,
  installCSSSupportsRuleConstructor,
} from "../api/css/css-supports-rule-constructor.js";

export function installCSSSupportsRule() {
  installCSSSupportsRuleConstructor();
  defineConstructorBacklink(CSSSupportsRule.prototype, CSSSupportsRule);
  defineToStringTag(CSSSupportsRule.prototype, "CSSSupportsRule");
}

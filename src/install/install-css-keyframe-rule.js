import {
  defineConstructorBacklink,
  definePrototypeGetter,
  defineToStringTag,
} from "../webidl/descriptor.js";
import {
  CSSKeyframeRule,
  installCSSKeyframeRuleConstructor,
} from "../api/css/css-keyframe-rule-constructor.js";
import { keyText, style } from "../api/css/css-keyframe-rule-members.js";

export function installCSSKeyframeRule() {
  installCSSKeyframeRuleConstructor();
  definePrototypeGetter(CSSKeyframeRule.prototype, "keyText", keyText);
  definePrototypeGetter(CSSKeyframeRule.prototype, "style", style);
  defineConstructorBacklink(CSSKeyframeRule.prototype, CSSKeyframeRule);
  defineToStringTag(CSSKeyframeRule.prototype, "CSSKeyframeRule");
}

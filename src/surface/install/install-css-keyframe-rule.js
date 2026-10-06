import {
  defineConstructorBacklink,
  definePrototypeGetter,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  CSSKeyframeRule,
  installCSSKeyframeRuleConstructor,
} from "../api/css/css-keyframe-rule-constructor.js";
import { cssKeyframeRuleGetterTable } from "../api/css/css-keyframe-rule-members.js";

export function installCSSKeyframeRule() {
  installCSSKeyframeRuleConstructor();
  for (const [name, entry] of cssKeyframeRuleGetterTable) definePrototypeGetter(CSSKeyframeRule.prototype, name, entry);
  defineConstructorBacklink(CSSKeyframeRule.prototype, CSSKeyframeRule);
  defineToStringTag(CSSKeyframeRule.prototype, "CSSKeyframeRule");
}

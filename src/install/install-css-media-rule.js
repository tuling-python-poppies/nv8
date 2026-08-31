import {
  defineConstructorBacklink,
  definePrototypeGetter,
  defineToStringTag,
} from "../webidl/descriptor.js";
import {
  CSSMediaRule,
  installCSSMediaRuleConstructor,
} from "../api/css/css-media-rule-constructor.js";
import { media } from "../api/css/css-media-rule-media-getter.js";

export function installCSSMediaRule() {
  installCSSMediaRuleConstructor();
  definePrototypeGetter(CSSMediaRule.prototype, "media", media);
  defineConstructorBacklink(CSSMediaRule.prototype, CSSMediaRule);
  defineToStringTag(CSSMediaRule.prototype, "CSSMediaRule");
}

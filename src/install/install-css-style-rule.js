import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../webidl/descriptor.js";
import {
  CSSStyleRule,
  installCSSStyleRuleConstructor,
} from "../api/css/css-style-rule-constructor.js";
import { selectorText } from "../api/css/css-style-rule-selector-text-property.js";
import { style } from "../api/css/css-style-rule-style-getter.js";
import { styleMap } from "../api/css/css-style-rule-style-map-getter.js";
import { cssRules } from "../api/css/css-style-rule-css-rules-getter.js";
import { deleteRule } from "../api/css/css-style-rule-delete-rule.js";
import { insertRule } from "../api/css/css-style-rule-insert-rule.js";

export function installCSSStyleRule() {
  installCSSStyleRuleConstructor();
  definePrototypeAccessor(CSSStyleRule.prototype, "selectorText", selectorText.get, selectorText.set);
  definePrototypeGetter(CSSStyleRule.prototype, "style", style);
  definePrototypeGetter(CSSStyleRule.prototype, "styleMap", styleMap);
  definePrototypeGetter(CSSStyleRule.prototype, "cssRules", cssRules);
  definePrototypeMethod(CSSStyleRule.prototype, "deleteRule", deleteRule);
  definePrototypeMethod(CSSStyleRule.prototype, "insertRule", insertRule);
  defineConstructorBacklink(CSSStyleRule.prototype, CSSStyleRule);
  defineToStringTag(CSSStyleRule.prototype, "CSSStyleRule");
}

import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import { CSSRule, installCSSRuleConstructor } from "../api/css/css-rule-constructor.js";
import { type } from "../api/css/css-rule-type-getter.js";
import { cssText } from "../api/css/css-rule-css-text-property.js";
import { parentRule } from "../api/css/css-rule-parent-rule-getter.js";
import { parentStyleSheet } from "../api/css/css-rule-parent-style-sheet-getter.js";

const constants = [
  ["STYLE_RULE", 1],
  ["CHARSET_RULE", 2],
  ["IMPORT_RULE", 3],
  ["MEDIA_RULE", 4],
  ["FONT_FACE_RULE", 5],
  ["PAGE_RULE", 6],
  ["MARGIN_RULE", 9],
  ["NAMESPACE_RULE", 10],
  ["KEYFRAMES_RULE", 7],
  ["KEYFRAME_RULE", 8],
  ["COUNTER_STYLE_RULE", 11],
  ["FONT_FEATURE_VALUES_RULE", 14],
  ["SUPPORTS_RULE", 12],
];

export function installCSSRule() {
  installCSSRuleConstructor();
  definePrototypeGetter(CSSRule.prototype, "type", type);
  definePrototypeAccessor(CSSRule.prototype, "cssText", cssText.get, cssText.set);
  definePrototypeGetter(CSSRule.prototype, "parentRule", parentRule);
  definePrototypeGetter(CSSRule.prototype, "parentStyleSheet", parentStyleSheet);
  for (const [name, value] of constants) {
    defineConstant(CSSRule.prototype, name, value);
  }
  defineConstructorBacklink(CSSRule.prototype, CSSRule);
  defineToStringTag(CSSRule.prototype, "CSSRule");
  for (const [name, value] of constants) {
    defineConstant(CSSRule, name, value);
  }
}

function defineConstant(target, name, value) {
  Object.defineProperty(target, name, {
    value,
    writable: false,
    enumerable: true,
    configurable: false,
  });
}

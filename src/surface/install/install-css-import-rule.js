import {
  defineConstructorBacklink,
  definePrototypeGetter,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  CSSImportRule,
  installCSSImportRuleConstructor,
} from "../api/css/css-import-rule-constructor.js";
import {
  href,
  layerName,
  media,
  styleSheet,
  supportsText,
} from "../api/css/css-import-rule-getters.js";

export function installCSSImportRule() {
  installCSSImportRuleConstructor();
  definePrototypeGetter(CSSImportRule.prototype, "href", href);
  definePrototypeGetter(CSSImportRule.prototype, "media", media);
  definePrototypeGetter(CSSImportRule.prototype, "styleSheet", styleSheet);
  definePrototypeGetter(CSSImportRule.prototype, "layerName", layerName);
  definePrototypeGetter(CSSImportRule.prototype, "supportsText", supportsText);
  defineConstructorBacklink(CSSImportRule.prototype, CSSImportRule);
  defineToStringTag(CSSImportRule.prototype, "CSSImportRule");
}

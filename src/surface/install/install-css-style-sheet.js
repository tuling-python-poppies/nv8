import {
  defineConstructorBacklink,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  CSSStyleSheet,
  installCSSStyleSheetConstructor,
} from "../api/css/css-style-sheet-constructor.js";
import { ownerRule } from "../api/css/css-style-sheet-owner-rule-getter.js";
import { cssRules } from "../api/css/css-style-sheet-css-rules-getter.js";
import { rules } from "../api/css/css-style-sheet-rules-getter.js";
import { addRule } from "../api/css/css-style-sheet-add-rule.js";
import {
  deleteRule,
  insertRule,
  removeRule,
  replaceSync,
} from "../api/css/css-style-sheet-method-members.js";
import { replace } from "../api/css/css-style-sheet-replace.js";

export function installCSSStyleSheet() {
  installCSSStyleSheetConstructor();
  definePrototypeGetter(CSSStyleSheet.prototype, "ownerRule", ownerRule);
  definePrototypeGetter(CSSStyleSheet.prototype, "cssRules", cssRules);
  definePrototypeGetter(CSSStyleSheet.prototype, "rules", rules);
  definePrototypeMethod(CSSStyleSheet.prototype, "addRule", addRule);
  definePrototypeMethod(CSSStyleSheet.prototype, "deleteRule", deleteRule);
  definePrototypeMethod(CSSStyleSheet.prototype, "insertRule", insertRule);
  definePrototypeMethod(CSSStyleSheet.prototype, "removeRule", removeRule);
  definePrototypeMethod(CSSStyleSheet.prototype, "replace", replace);
  definePrototypeMethod(CSSStyleSheet.prototype, "replaceSync", replaceSync);
  defineConstructorBacklink(CSSStyleSheet.prototype, CSSStyleSheet);
  defineToStringTag(CSSStyleSheet.prototype, "CSSStyleSheet");
}

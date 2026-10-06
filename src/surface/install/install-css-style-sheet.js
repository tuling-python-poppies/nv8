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
import { replace } from "../api/css/css-style-sheet-replace.js";
import { cssStyleSheetMethodTable } from "../api/css/css-style-sheet-method-members.js";

export function installCSSStyleSheet() {
  installCSSStyleSheetConstructor();
  definePrototypeGetter(CSSStyleSheet.prototype, "ownerRule", ownerRule);
  definePrototypeGetter(CSSStyleSheet.prototype, "cssRules", cssRules);
  definePrototypeGetter(CSSStyleSheet.prototype, "rules", rules);
  definePrototypeMethod(CSSStyleSheet.prototype, "addRule", addRule);
  for (const [name, entry] of cssStyleSheetMethodTable) definePrototypeMethod(CSSStyleSheet.prototype, name, entry);
  definePrototypeMethod(CSSStyleSheet.prototype, "replace", replace);
  for (const [name, entry] of cssStyleSheetMethodTable) definePrototypeMethod(CSSStyleSheet.prototype, name, entry);
  defineConstructorBacklink(CSSStyleSheet.prototype, CSSStyleSheet);
  defineToStringTag(CSSStyleSheet.prototype, "CSSStyleSheet");
}

import {
  defineConstructorBacklink,
  definePrototypeGetter,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  CSSImportRule,
  installCSSImportRuleConstructor,
} from "../api/css/css-import-rule-constructor.js";
import { cssImportRuleGetterTable } from "../api/css/css-import-rule-getters.js";

export function installCSSImportRule() {
  installCSSImportRuleConstructor();
  for (const [name, entry] of cssImportRuleGetterTable) definePrototypeGetter(CSSImportRule.prototype, name, entry);
  defineConstructorBacklink(CSSImportRule.prototype, CSSImportRule);
  defineToStringTag(CSSImportRule.prototype, "CSSImportRule");
}

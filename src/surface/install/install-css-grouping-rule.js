import {
  defineConstructorBacklink,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  CSSGroupingRule,
  installCSSGroupingRuleConstructor,
} from "../api/css/css-grouping-rule-constructor.js";
import { cssRules } from "../api/css/css-grouping-rule-css-rules-getter.js";
import { deleteRule } from "../api/css/css-grouping-rule-delete-rule.js";
import { insertRule } from "../api/css/css-grouping-rule-insert-rule.js";

export function installCSSGroupingRule() {
  installCSSGroupingRuleConstructor();
  definePrototypeGetter(CSSGroupingRule.prototype, "cssRules", cssRules);
  definePrototypeMethod(CSSGroupingRule.prototype, "deleteRule", deleteRule);
  definePrototypeMethod(CSSGroupingRule.prototype, "insertRule", insertRule);
  defineConstructorBacklink(CSSGroupingRule.prototype, CSSGroupingRule);
  defineToStringTag(CSSGroupingRule.prototype, "CSSGroupingRule");
}

import {
  defineConstructorBacklink,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  CSSRuleList,
  installCSSRuleListConstructor,
} from "../api/css/css-rule-list-constructor.js";
import { length } from "../api/css/css-rule-list-length-getter.js";
import { item } from "../api/css/css-rule-list-item.js";
import { values } from "../api/css/css-rule-list-values.js";

export function installCSSRuleList() {
  installCSSRuleListConstructor();
  definePrototypeGetter(CSSRuleList.prototype, "length", length);
  definePrototypeMethod(CSSRuleList.prototype, "item", item);
  defineConstructorBacklink(CSSRuleList.prototype, CSSRuleList);
  defineToStringTag(CSSRuleList.prototype, "CSSRuleList");
  definePrototypeMethod(
    CSSRuleList.prototype,
    Symbol.iterator,
    values,
    "values",
    false,
  );
}

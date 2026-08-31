import {
  defineConstructorBacklink,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../webidl/descriptor.js";
import {
  CSSKeyframesRule,
  installCSSKeyframesRuleConstructor,
} from "../api/css/css-keyframes-rule-constructor.js";
import {
  appendRule,
  cssRules,
  deleteRule,
  findRule,
  length,
  name,
  values,
} from "../api/css/css-keyframes-rule-members.js";

export function installCSSKeyframesRule() {
  installCSSKeyframesRuleConstructor();
  definePrototypeGetter(CSSKeyframesRule.prototype, "name", name);
  definePrototypeGetter(CSSKeyframesRule.prototype, "cssRules", cssRules);
  definePrototypeMethod(CSSKeyframesRule.prototype, "appendRule", appendRule);
  definePrototypeMethod(CSSKeyframesRule.prototype, "deleteRule", deleteRule);
  definePrototypeMethod(CSSKeyframesRule.prototype, "findRule", findRule);
  definePrototypeGetter(CSSKeyframesRule.prototype, "length", length);
  defineConstructorBacklink(CSSKeyframesRule.prototype, CSSKeyframesRule);
  defineToStringTag(CSSKeyframesRule.prototype, "CSSKeyframesRule");
  Object.defineProperty(CSSKeyframesRule.prototype, Symbol.iterator, {
    value: values,
    writable: true,
    configurable: true,
  });
}

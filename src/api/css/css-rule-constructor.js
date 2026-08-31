import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";

export function CSSRule() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(CSSRule, "CSSRule");

export function installCSSRuleConstructor() {
  delete CSSRule.prototype.constructor;
  defineGlobalConstructor("CSSRule", CSSRule);
}

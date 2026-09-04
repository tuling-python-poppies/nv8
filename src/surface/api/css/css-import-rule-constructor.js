import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { CSSRule } from "./css-rule-constructor.js";

export function CSSImportRule() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(CSSImportRule, "CSSImportRule");

export function installCSSImportRuleConstructor() {
  Object.setPrototypeOf(CSSImportRule.prototype, CSSRule.prototype);
  Object.setPrototypeOf(CSSImportRule, CSSRule);
  delete CSSImportRule.prototype.constructor;
  defineGlobalConstructor("CSSImportRule", CSSImportRule);
}

import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";

export function CSSRuleList() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(CSSRuleList, "CSSRuleList");

export function installCSSRuleListConstructor() {
  delete CSSRuleList.prototype.constructor;
  defineGlobalConstructor("CSSRuleList", CSSRuleList);
}

import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";

export function CSSRuleList() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(CSSRuleList, "CSSRuleList");

export function installCSSRuleListConstructor() {
  delete CSSRuleList.prototype.constructor;
  defineGlobalConstructor("CSSRuleList", CSSRuleList);
}

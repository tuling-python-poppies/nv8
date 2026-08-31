import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { refreshCSSRuleList } from "./css-rule-list-state.js";
export function item(index) {
  const result = refreshCSSRuleList(this)[Number(index) >>> 0] ?? null;
  traceCall("window.CSSRuleList.prototype.item", "CSSRuleList", [index], result);
  return result;
}
registerNativeFunction(item, "item");

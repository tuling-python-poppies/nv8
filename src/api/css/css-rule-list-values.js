import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { refreshCSSRuleList } from "./css-rule-list-state.js";
export function values() {
  const result = refreshCSSRuleList(this).values();
  traceCall("window.CSSRuleList.prototype.Symbol(Symbol.iterator)", "CSSRuleList", [], result);
  return result;
}
registerNativeFunction(values, "values");

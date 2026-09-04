import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { refreshCSSRuleList } from "./css-rule-list-state.js";
export const length = Object.getOwnPropertyDescriptor({
  get length() {
    const result = refreshCSSRuleList(this).length;
    traceGetter("window.CSSRuleList.prototype.length", "CSSRuleList", result);
    return result;
  },
}, "length").get;
registerNativeGetter(length, "length");

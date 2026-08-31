import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { tokensOf, validateToken } from "./dom-token-list-state.js";

export const contains = {
  contains(value) {
    const token = validateToken(value);
    const result = tokensOf(this).includes(token);
    traceCall("window.DOMTokenList.prototype.contains", "DOMTokenList", [value], result);
    return result;
  },
}.contains;
registerNativeFunction(contains, "contains");

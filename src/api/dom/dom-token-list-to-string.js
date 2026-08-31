import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireDOMTokenList } from "./dom-token-list-state.js";
import { getAttributeValue } from "./element-state.js";

export const toString = {
  toString() {
    const state = requireDOMTokenList(this);
    const result = getAttributeValue(state.element, state.attributeName) ?? "";
    traceCall("window.DOMTokenList.prototype.toString", "DOMTokenList", [], result);
    return result;
  },
}.toString;
registerNativeFunction(toString, "toString");

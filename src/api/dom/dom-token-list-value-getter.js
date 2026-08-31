import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireDOMTokenList } from "./dom-token-list-state.js";
import { getAttributeValue } from "./element-state.js";

export const value = Object.getOwnPropertyDescriptor({
  get value() {
    const state = requireDOMTokenList(this);
    const result = getAttributeValue(state.element, state.attributeName) ?? "";
    traceGetter("window.DOMTokenList.prototype.value", "DOMTokenList", result);
    return result;
  },
}, "value").get;
registerNativeGetter(value, "value");

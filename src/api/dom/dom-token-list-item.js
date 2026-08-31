import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { refreshDOMTokenList } from "./dom-token-list-state.js";

export const item = {
  item(index) {
    const result = refreshDOMTokenList(this)[Number(index) >>> 0] ?? null;
    traceCall("window.DOMTokenList.prototype.item", "DOMTokenList", [index], result);
    return result;
  },
}.item;
registerNativeFunction(item, "item");

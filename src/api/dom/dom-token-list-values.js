import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { refreshDOMTokenList } from "./dom-token-list-state.js";

export const values = {
  values() {
    const result = refreshDOMTokenList(this).values();
    traceCall("window.DOMTokenList.prototype.values", "DOMTokenList", [], result);
    return result;
  },
}.values;
registerNativeFunction(values, "values");

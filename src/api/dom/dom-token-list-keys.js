import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { refreshDOMTokenList } from "./dom-token-list-state.js";

export const keys = {
  keys() {
    const result = refreshDOMTokenList(this).keys();
    traceCall("window.DOMTokenList.prototype.keys", "DOMTokenList", [], result);
    return result;
  },
}.keys;
registerNativeFunction(keys, "keys");

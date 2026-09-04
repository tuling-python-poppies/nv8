import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { refreshDOMTokenList } from "./dom-token-list-state.js";

export const entries = {
  entries() {
    const result = refreshDOMTokenList(this).entries();
    traceCall("window.DOMTokenList.prototype.entries", "DOMTokenList", [], result);
    return result;
  },
}.entries;
registerNativeFunction(entries, "entries");

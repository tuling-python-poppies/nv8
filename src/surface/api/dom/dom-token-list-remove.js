import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  setTokens,
  tokensOf,
  validateToken,
} from "./dom-token-list-state.js";

export const remove = {
  remove(...values) {
    const removals = values.map(validateToken);
    setTokens(this, tokensOf(this).filter(token => !removals.includes(token)));
    traceCall("window.DOMTokenList.prototype.remove", "DOMTokenList", values, undefined);
  },
}.remove;
registerNativeFunction(remove, "remove");

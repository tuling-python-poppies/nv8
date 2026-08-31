import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import {
  setTokens,
  tokensOf,
  validateToken,
} from "./dom-token-list-state.js";

export const add = {
  add(...values) {
    const additions = values.map(validateToken);
    const tokens = tokensOf(this);
    for (const token of additions) {
      if (!tokens.includes(token)) {
        tokens.push(token);
      }
    }
    setTokens(this, tokens);
    traceCall("window.DOMTokenList.prototype.add", "DOMTokenList", values, undefined);
  },
}.add;
registerNativeFunction(add, "add");

import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import {
  setTokens,
  tokensOf,
  validateToken,
} from "./dom-token-list-state.js";

export const replace = {
  replace(oldToken, newToken) {
    const oldValue = validateToken(oldToken);
    const newValue = validateToken(newToken);
    const tokens = tokensOf(this);
    const index = tokens.indexOf(oldValue);
    if (index < 0) {
      traceCall("window.DOMTokenList.prototype.replace", "DOMTokenList", [oldToken, newToken], false);
      return false;
    }
    if (!tokens.includes(newValue)) {
      tokens[index] = newValue;
    } else {
      tokens.splice(index, 1);
    }
    setTokens(this, tokens);
    traceCall("window.DOMTokenList.prototype.replace", "DOMTokenList", [oldToken, newToken], true);
    return true;
  },
}.replace;
registerNativeFunction(replace, "replace");

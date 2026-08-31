import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import {
  setTokens,
  tokensOf,
  validateToken,
} from "./dom-token-list-state.js";

export const toggle = {
  toggle(value) {
    const token = validateToken(value);
    const force = arguments.length > 1 ? Boolean(arguments[1]) : undefined;
    const tokens = tokensOf(this);
    const present = tokens.includes(token);
    let result = present;
    if (present && force !== true) {
      tokens.splice(tokens.indexOf(token), 1);
      result = false;
    } else if (!present && force !== false) {
      tokens.push(token);
      result = true;
    }
    setTokens(this, tokens);
    traceCall("window.DOMTokenList.prototype.toggle", "DOMTokenList", [value, force], result);
    return result;
  },
}.toggle;
registerNativeFunction(toggle, "toggle");

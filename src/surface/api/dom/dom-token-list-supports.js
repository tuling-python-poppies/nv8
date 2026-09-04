import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireDOMTokenList, validateToken } from "./dom-token-list-state.js";

export const supports = {
  supports(token) {
    requireDOMTokenList(this);
    validateToken(token);
    throw new TypeError("DOMTokenList has no supported tokens.");
  },
}.supports;
registerNativeFunction(supports, "supports");

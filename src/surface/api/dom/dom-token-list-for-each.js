import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { refreshDOMTokenList } from "./dom-token-list-state.js";

export const forEach = {
  forEach(callback) {
    if (typeof callback !== "function") {
      throw new TypeError(`${callback} is not a function`);
    }
    const thisArg = arguments[1];
    const values = refreshDOMTokenList(this);
    values.forEach((value, index) => callback.call(thisArg, value, index, this));
    traceCall("window.DOMTokenList.prototype.forEach", "DOMTokenList", [callback], undefined);
  },
}.forEach;
registerNativeFunction(forEach, "forEach");

import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { refreshDOMTokenList } from "./dom-token-list-state.js";

export const length = Object.getOwnPropertyDescriptor({
  get length() {
    const value = refreshDOMTokenList(this).length;
    traceGetter("window.DOMTokenList.prototype.length", "DOMTokenList", value);
    return value;
  },
}, "length").get;
registerNativeGetter(length, "length");

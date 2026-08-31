import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { createDOMTokenList } from "./dom-token-list-state.js";
import { requireElement } from "./element-state.js";

const relLists = new WeakMap();

export const relList = Object.getOwnPropertyDescriptor({
  get relList() {
    requireElement(this);
    let result = relLists.get(this);
    if (result === undefined) {
      result = createDOMTokenList(this, "rel");
      relLists.set(this, result);
    }
    traceGetter(
      "window.HTMLAnchorElement.prototype.relList",
      "HTMLAnchorElement",
      result,
    );
    return result;
  },
}, "relList").get;
registerNativeGetter(relList, "relList");

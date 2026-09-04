import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { createDOMTokenList } from "./dom-token-list-state.js";
import { requireElement } from "./element-state.js";
const lists = new WeakMap();
const descriptor = Object.getOwnPropertyDescriptor({
  get relList() {
    requireElement(this);
    let result = lists.get(this);
    if (result === undefined) {
      result = createDOMTokenList(this, "rel");
      lists.set(this, result);
    }
    traceGetter("window.HTMLAreaElement.prototype.relList", "HTMLAreaElement", result);
    return result;
  },
  set relList(value) {
    requireElement(this);
    this.setAttribute("rel", `${value}`);
  },
}, "relList");
export const relList = descriptor.get;
export const setRelList = descriptor.set;
registerNativeGetter(relList, "relList");
registerNativeFunction(setRelList, "set relList");

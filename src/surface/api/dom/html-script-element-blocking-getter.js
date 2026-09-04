import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { createDOMTokenList } from "./dom-token-list-state.js";
import { requireElement } from "./element-state.js";

const blockingLists = new WeakMap();

export const blocking = Object.getOwnPropertyDescriptor({
  get blocking() {
    requireElement(this);
    let result = blockingLists.get(this);
    if (result === undefined) {
      result = createDOMTokenList(this, "blocking");
      blockingLists.set(this, result);
    }
    traceGetter(
      "window.HTMLScriptElement.prototype.blocking",
      "HTMLScriptElement",
      result,
    );
    return result;
  },
}, "blocking").get;
registerNativeGetter(blocking, "blocking");

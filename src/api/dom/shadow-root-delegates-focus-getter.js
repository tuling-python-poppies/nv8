import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireShadowRoot } from "./shadow-root-state.js";

export const delegatesFocus = Object.getOwnPropertyDescriptor({
  get delegatesFocus() {
    const result = requireShadowRoot(this).delegatesFocus;
    traceGetter(
      "window.ShadowRoot.prototype.delegatesFocus",
      "ShadowRoot",
      result,
    );
    return result;
  },
}, "delegatesFocus").get;
registerNativeGetter(delegatesFocus, "delegatesFocus");

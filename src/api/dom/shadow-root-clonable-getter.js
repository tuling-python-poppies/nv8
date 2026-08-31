import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireShadowRoot } from "./shadow-root-state.js";

export const clonable = Object.getOwnPropertyDescriptor({
  get clonable() {
    const result = requireShadowRoot(this).clonable;
    traceGetter(
      "window.ShadowRoot.prototype.clonable",
      "ShadowRoot",
      result,
    );
    return result;
  },
}, "clonable").get;
registerNativeGetter(clonable, "clonable");

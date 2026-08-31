import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireShadowRoot } from "./shadow-root-state.js";

export const activeElement = Object.getOwnPropertyDescriptor({
  get activeElement() {
    requireShadowRoot(this);
    const result = null;
    traceGetter(
      "window.ShadowRoot.prototype.activeElement",
      "ShadowRoot",
      result,
    );
    return result;
  },
}, "activeElement").get;
registerNativeGetter(activeElement, "activeElement");

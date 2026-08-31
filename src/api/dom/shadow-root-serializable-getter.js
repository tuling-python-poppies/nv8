import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireShadowRoot } from "./shadow-root-state.js";

export const serializable = Object.getOwnPropertyDescriptor({
  get serializable() {
    const result = requireShadowRoot(this).serializable;
    traceGetter(
      "window.ShadowRoot.prototype.serializable",
      "ShadowRoot",
      result,
    );
    return result;
  },
}, "serializable").get;
registerNativeGetter(serializable, "serializable");

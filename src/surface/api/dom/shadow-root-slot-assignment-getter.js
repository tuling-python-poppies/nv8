import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireShadowRoot } from "./shadow-root-state.js";

export const slotAssignment = Object.getOwnPropertyDescriptor({
  get slotAssignment() {
    const result = requireShadowRoot(this).slotAssignment;
    traceGetter(
      "window.ShadowRoot.prototype.slotAssignment",
      "ShadowRoot",
      result,
    );
    return result;
  },
}, "slotAssignment").get;
registerNativeGetter(slotAssignment, "slotAssignment");

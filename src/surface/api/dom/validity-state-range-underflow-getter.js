import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { validityFlags } from "./validity-state-state.js";
export const rangeUnderflow = Object.getOwnPropertyDescriptor({
  get rangeUnderflow() {
    const result = validityFlags(this).rangeUnderflow;
    traceGetter("window.ValidityState.prototype.rangeUnderflow", "ValidityState", result);
    return result;
  },
}, "rangeUnderflow").get;
registerNativeGetter(rangeUnderflow, "rangeUnderflow");

import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { validityFlags } from "./validity-state-state.js";
export const rangeOverflow = Object.getOwnPropertyDescriptor({
  get rangeOverflow() {
    const result = validityFlags(this).rangeOverflow;
    traceGetter("window.ValidityState.prototype.rangeOverflow", "ValidityState", result);
    return result;
  },
}, "rangeOverflow").get;
registerNativeGetter(rangeOverflow, "rangeOverflow");

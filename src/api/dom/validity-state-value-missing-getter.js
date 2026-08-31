import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { validityFlags } from "./validity-state-state.js";
export const valueMissing = Object.getOwnPropertyDescriptor({
  get valueMissing() {
    const result = validityFlags(this).valueMissing;
    traceGetter("window.ValidityState.prototype.valueMissing", "ValidityState", result);
    return result;
  },
}, "valueMissing").get;
registerNativeGetter(valueMissing, "valueMissing");

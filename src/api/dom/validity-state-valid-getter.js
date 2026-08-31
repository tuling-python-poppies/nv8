import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { validityFlags } from "./validity-state-state.js";
export const valid = Object.getOwnPropertyDescriptor({
  get valid() {
    const result = validityFlags(this).valid;
    traceGetter("window.ValidityState.prototype.valid", "ValidityState", result);
    return result;
  },
}, "valid").get;
registerNativeGetter(valid, "valid");

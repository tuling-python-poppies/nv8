import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { validityFlags } from "./validity-state-state.js";
export const typeMismatch = Object.getOwnPropertyDescriptor({
  get typeMismatch() {
    const result = validityFlags(this).typeMismatch;
    traceGetter("window.ValidityState.prototype.typeMismatch", "ValidityState", result);
    return result;
  },
}, "typeMismatch").get;
registerNativeGetter(typeMismatch, "typeMismatch");

import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { validityFlags } from "./validity-state-state.js";
export const tooShort = Object.getOwnPropertyDescriptor({
  get tooShort() {
    const result = validityFlags(this).tooShort;
    traceGetter("window.ValidityState.prototype.tooShort", "ValidityState", result);
    return result;
  },
}, "tooShort").get;
registerNativeGetter(tooShort, "tooShort");

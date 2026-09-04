import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { validityFlags } from "./validity-state-state.js";
export const badInput = Object.getOwnPropertyDescriptor({
  get badInput() {
    const result = validityFlags(this).badInput;
    traceGetter("window.ValidityState.prototype.badInput", "ValidityState", result);
    return result;
  },
}, "badInput").get;
registerNativeGetter(badInput, "badInput");

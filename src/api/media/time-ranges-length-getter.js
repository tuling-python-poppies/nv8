import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireTimeRanges } from "./time-ranges-state.js";
export const length = Object.getOwnPropertyDescriptor({ get length() {
  const result = requireTimeRanges(this).length;
  traceGetter("window.TimeRanges.prototype.length", "TimeRanges", result);
  return result;
}}, "length").get;
registerNativeGetter(length, "length");

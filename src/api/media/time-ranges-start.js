import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireTimeRanges } from "./time-ranges-state.js";
export const start = {
  start(index) {
    const range = requireTimeRanges(this)[Number(index) >>> 0];
    if (range === undefined) {
      throw new TypeError("The index is not in the allowed range");
    }
    const result = range[0];
    traceCall("window.TimeRanges.prototype.start", "TimeRanges", [index], result);
    return result;
  },
}.start;
registerNativeFunction(start, "start");

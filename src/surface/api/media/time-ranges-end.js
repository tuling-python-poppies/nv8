import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireTimeRanges } from "./time-ranges-state.js";
export const end = {
  end(index) {
    const range = requireTimeRanges(this)[Number(index) >>> 0];
    if (range === undefined) {
      throw new TypeError("The index is not in the allowed range");
    }
    const result = range[1];
    traceCall("window.TimeRanges.prototype.end", "TimeRanges", [index], result);
    return result;
  },
}.end;
registerNativeFunction(end, "end");

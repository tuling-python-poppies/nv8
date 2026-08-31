import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { beforeAlgorithm } from "./character-data-algorithms.js";

export const before = {
  before(...values) {
    beforeAlgorithm(this, values);
    traceCall("window.DocumentType.prototype.before", "DocumentType", values, undefined);
  },
}.before;
registerNativeFunction(before, "before");

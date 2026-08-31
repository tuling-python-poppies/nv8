import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { afterAlgorithm } from "./character-data-algorithms.js";

export const after = {
  after(...values) {
    afterAlgorithm(this, values);
    traceCall("window.DocumentType.prototype.after", "DocumentType", values, undefined);
  },
}.after;
registerNativeFunction(after, "after");

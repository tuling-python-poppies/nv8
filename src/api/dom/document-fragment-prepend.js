import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { prependAlgorithm } from "./parent-node-algorithms.js";

export const prepend = {
  prepend(...values) {
    prependAlgorithm(this, values);
    traceCall("window.DocumentFragment.prototype.prepend", "DocumentFragment", values, undefined);
  },
}.prepend;
registerNativeFunction(prepend, "prepend");

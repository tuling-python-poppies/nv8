import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { appendAlgorithm } from "./parent-node-algorithms.js";

export const append = {
  append(...values) {
    appendAlgorithm(this, values);
    traceCall("window.DocumentFragment.prototype.append", "DocumentFragment", values, undefined);
  },
}.append;
registerNativeFunction(append, "append");

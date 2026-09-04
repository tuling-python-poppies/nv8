import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { cloneRangeAlgorithm } from "./range-algorithms.js";
import { Range } from "./range-constructor.js";

export const cloneRange = {
  cloneRange() {
    const result = cloneRangeAlgorithm(this);
    traceCall("window.Range.prototype.cloneRange", "Range", [], result);
    return result;
  },
}.cloneRange;
registerNativeFunction(cloneRange, "cloneRange");
export function installRangeCloneRange() {
  definePrototypeMethod(Range.prototype, "cloneRange", cloneRange);
}

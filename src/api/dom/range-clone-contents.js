import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { cloneContentsAlgorithm } from "./range-algorithms.js";
import { Range } from "./range-constructor.js";

export const cloneContents = {
  cloneContents() {
    const result = cloneContentsAlgorithm(this);
    traceCall("window.Range.prototype.cloneContents", "Range", [], result);
    return result;
  },
}.cloneContents;
registerNativeFunction(cloneContents, "cloneContents");
export function installRangeCloneContents() {
  definePrototypeMethod(Range.prototype, "cloneContents", cloneContents);
}

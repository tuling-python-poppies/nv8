import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
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

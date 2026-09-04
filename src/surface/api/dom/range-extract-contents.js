import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { extractContentsAlgorithm } from "./range-algorithms.js";
import { Range } from "./range-constructor.js";

export const extractContents = {
  extractContents() {
    const result = extractContentsAlgorithm(this);
    traceCall("window.Range.prototype.extractContents", "Range", [], result);
    return result;
  },
}.extractContents;
registerNativeFunction(extractContents, "extractContents");
export function installRangeExtractContents() {
  definePrototypeMethod(Range.prototype, "extractContents", extractContents);
}

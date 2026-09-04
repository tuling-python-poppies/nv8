import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { isPointInRangeAlgorithm } from "./range-algorithms.js";
import { Range } from "./range-constructor.js";

export const isPointInRange = {
  isPointInRange(node, offset) {
    const result = isPointInRangeAlgorithm(this, node, offset);
    traceCall("window.Range.prototype.isPointInRange", "Range", [node, offset], result);
    return result;
  },
}.isPointInRange;
registerNativeFunction(isPointInRange, "isPointInRange");
export function installRangeIsPointInRange() {
  definePrototypeMethod(Range.prototype, "isPointInRange", isPointInRange);
}

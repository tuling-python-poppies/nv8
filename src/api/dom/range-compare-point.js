import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { comparePointAlgorithm } from "./range-algorithms.js";
import { Range } from "./range-constructor.js";

export const comparePoint = {
  comparePoint(node, offset) {
    const result = comparePointAlgorithm(this, node, offset);
    traceCall("window.Range.prototype.comparePoint", "Range", [node, offset], result);
    return result;
  },
}.comparePoint;
registerNativeFunction(comparePoint, "comparePoint");
export function installRangeComparePoint() {
  definePrototypeMethod(Range.prototype, "comparePoint", comparePoint);
}

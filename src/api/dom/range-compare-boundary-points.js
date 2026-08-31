import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { compareBoundaryPointsAlgorithm } from "./range-algorithms.js";
import { Range } from "./range-constructor.js";

export const compareBoundaryPoints = {
  compareBoundaryPoints(how, sourceRange) {
    const result = compareBoundaryPointsAlgorithm(this, how, sourceRange);
    traceCall(
      "window.Range.prototype.compareBoundaryPoints",
      "Range",
      [how, sourceRange],
      result,
    );
    return result;
  },
}.compareBoundaryPoints;
registerNativeFunction(compareBoundaryPoints, "compareBoundaryPoints");
export function installRangeCompareBoundaryPoints() {
  definePrototypeMethod(
    Range.prototype,
    "compareBoundaryPoints",
    compareBoundaryPoints,
  );
}

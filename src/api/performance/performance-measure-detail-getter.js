import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { PerformanceMeasure } from "./performance-measure-constructor.js";
import { requirePerformanceMeasure } from "./performance-measure-state.js";

export const performanceMeasureDetail = {
  performanceMeasureDetail() {
  const value = requirePerformanceMeasure(this).detail;
  traceGetter(
    "window.PerformanceMeasure.prototype.detail",
    "PerformanceMeasure",
    value,
  );
  return value;

  },
}.performanceMeasureDetail;

registerNativeGetter(performanceMeasureDetail, "detail");

export function installPerformanceMeasureDetail() {
  definePrototypeGetter(
    PerformanceMeasure.prototype,
    "detail",
    performanceMeasureDetail,
  );
}

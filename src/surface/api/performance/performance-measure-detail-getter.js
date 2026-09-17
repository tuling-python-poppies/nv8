import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { PerformanceMeasure } from "./performance-measure-constructor.js";
import { requirePerformanceMeasure } from "./performance-measure-state.js";

const performanceMeasureDetail = {
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

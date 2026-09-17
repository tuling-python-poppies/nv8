import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { PerformanceMark } from "./performance-mark-constructor.js";
import { requirePerformanceMark } from "./performance-mark-state.js";

const performanceMarkDetail = {
  performanceMarkDetail() {
  const value = requirePerformanceMark(this).detail;
  traceGetter(
    "window.PerformanceMark.prototype.detail",
    "PerformanceMark",
    value,
  );
  return value;

  },
}.performanceMarkDetail;

registerNativeGetter(performanceMarkDetail, "detail");

export function installPerformanceMarkDetail() {
  definePrototypeGetter(
    PerformanceMark.prototype,
    "detail",
    performanceMarkDetail,
  );
}

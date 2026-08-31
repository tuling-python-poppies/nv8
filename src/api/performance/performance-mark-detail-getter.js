import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { PerformanceMark } from "./performance-mark-constructor.js";
import { requirePerformanceMark } from "./performance-mark-state.js";

export const performanceMarkDetail = {
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

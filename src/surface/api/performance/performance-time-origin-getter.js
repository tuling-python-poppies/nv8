import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Performance } from "./performance-constructor.js";
import { requirePerformance } from "./performance-state.js";

const performanceTimeOrigin = {
  performanceTimeOrigin() {
  const value = requirePerformance(this).timeOrigin;
  traceGetter("window.Performance.prototype.timeOrigin", "Performance", value);
  return value;

  },
}.performanceTimeOrigin;

registerNativeGetter(performanceTimeOrigin, "timeOrigin");

export function installPerformanceTimeOrigin() {
  definePrototypeGetter(
    Performance.prototype,
    "timeOrigin",
    performanceTimeOrigin,
  );
}

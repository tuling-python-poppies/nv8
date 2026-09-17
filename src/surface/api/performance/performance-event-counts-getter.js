import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Performance } from "./performance-constructor.js";
import { requirePerformance } from "./performance-state.js";

const performanceEventCounts = {
  performanceEventCounts() {
  const value = requirePerformance(this).eventCounts;
  traceGetter("window.Performance.prototype.eventCounts", "Performance", value);
  return value;

  },
}.performanceEventCounts;

registerNativeGetter(performanceEventCounts, "eventCounts");

export function installPerformanceEventCounts() {
  definePrototypeGetter(
    Performance.prototype,
    "eventCounts",
    performanceEventCounts,
  );
}

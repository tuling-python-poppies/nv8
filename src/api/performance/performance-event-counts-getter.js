import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Performance } from "./performance-constructor.js";
import { requirePerformance } from "./performance-state.js";

export const performanceEventCounts = {
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

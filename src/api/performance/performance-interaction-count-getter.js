import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Performance } from "./performance-constructor.js";
import { requirePerformance } from "./performance-state.js";

export const performanceInteractionCount = {
  performanceInteractionCount() {
  const value = requirePerformance(this).interactionCount;
  traceGetter(
    "window.Performance.prototype.interactionCount",
    "Performance",
    value,
  );
  return value;

  },
}.performanceInteractionCount;

registerNativeGetter(performanceInteractionCount, "interactionCount");

export function installPerformanceInteractionCount() {
  definePrototypeGetter(
    Performance.prototype,
    "interactionCount",
    performanceInteractionCount,
  );
}

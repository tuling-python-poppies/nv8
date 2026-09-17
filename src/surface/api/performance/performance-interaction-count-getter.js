import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Performance } from "./performance-constructor.js";
import { requirePerformance } from "./performance-state.js";

const performanceInteractionCount = {
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

import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Performance } from "./performance-constructor.js";
import { requirePerformance } from "./performance-state.js";

export const performanceTiming = {
  performanceTiming() {
  const value = requirePerformance(this).timing;
  traceGetter("window.Performance.prototype.timing", "Performance", value);
  return value;

  },
}.performanceTiming;

registerNativeGetter(performanceTiming, "timing");

export function installPerformanceTiming() {
  definePrototypeGetter(Performance.prototype, "timing", performanceTiming);
}

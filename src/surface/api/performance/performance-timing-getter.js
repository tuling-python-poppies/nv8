import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Performance } from "./performance-constructor.js";
import { requirePerformance } from "./performance-state.js";

const performanceTiming = {
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

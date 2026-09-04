import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Performance } from "./performance-constructor.js";
import { requirePerformance } from "./performance-state.js";

export const performanceNavigation = {
  performanceNavigation() {
  const value = requirePerformance(this).navigation;
  traceGetter("window.Performance.prototype.navigation", "Performance", value);
  return value;

  },
}.performanceNavigation;

registerNativeGetter(performanceNavigation, "navigation");

export function installPerformanceNavigation() {
  definePrototypeGetter(
    Performance.prototype,
    "navigation",
    performanceNavigation,
  );
}

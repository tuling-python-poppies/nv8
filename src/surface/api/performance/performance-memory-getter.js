import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Performance } from "./performance-constructor.js";
import { requirePerformance } from "./performance-state.js";

const performanceMemory = {
  performanceMemory() {
  const value = requirePerformance(this).memory;
  traceGetter("window.Performance.prototype.memory", "Performance", value);
  return value;

  },
}.performanceMemory;

registerNativeGetter(performanceMemory, "memory");

export function installPerformanceMemory() {
  definePrototypeGetter(Performance.prototype, "memory", performanceMemory);
}

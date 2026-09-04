import { monotonicNow } from "../../../infra/scheduler/monotonic-clock.js";
import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { Performance } from "./performance-constructor.js";
import { requirePerformance } from "./performance-state.js";

export const now = {
  now() {
  requirePerformance(this);
  const value = monotonicNow();
  traceCall("window.Performance.prototype.now", "Performance", [], value);
  return value;

  },
}.now;

registerNativeFunction(now, "now");

export function installPerformanceNow() {
  definePrototypeMethod(Performance.prototype, "now", now);
}

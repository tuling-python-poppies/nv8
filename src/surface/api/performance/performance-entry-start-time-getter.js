import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { PerformanceEntry } from "./performance-entry-constructor.js";
import { requirePerformanceEntry } from "./performance-entry-state.js";

export const performanceEntryStartTime = {
  performanceEntryStartTime() {
  const value = requirePerformanceEntry(this).startTime;
  traceGetter(
    "window.PerformanceEntry.prototype.startTime",
    "PerformanceEntry",
    value,
  );
  return value;

  },
}.performanceEntryStartTime;

registerNativeGetter(performanceEntryStartTime, "startTime");

export function installPerformanceEntryStartTime() {
  definePrototypeGetter(
    PerformanceEntry.prototype,
    "startTime",
    performanceEntryStartTime,
  );
}

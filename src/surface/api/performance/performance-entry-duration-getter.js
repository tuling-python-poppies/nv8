import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { PerformanceEntry } from "./performance-entry-constructor.js";
import { requirePerformanceEntry } from "./performance-entry-state.js";

const performanceEntryDuration = {
  performanceEntryDuration() {
  const value = requirePerformanceEntry(this).duration;
  traceGetter(
    "window.PerformanceEntry.prototype.duration",
    "PerformanceEntry",
    value,
  );
  return value;

  },
}.performanceEntryDuration;

registerNativeGetter(performanceEntryDuration, "duration");

export function installPerformanceEntryDuration() {
  definePrototypeGetter(
    PerformanceEntry.prototype,
    "duration",
    performanceEntryDuration,
  );
}

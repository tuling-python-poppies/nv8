import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { PerformanceEntry } from "./performance-entry-constructor.js";
import { requirePerformanceEntry } from "./performance-entry-state.js";

export const performanceEntryType = {
  performanceEntryType() {
  const value = requirePerformanceEntry(this).entryType;
  traceGetter("window.PerformanceEntry.prototype.entryType", "PerformanceEntry", value);
  return value;

  },
}.performanceEntryType;

registerNativeGetter(performanceEntryType, "entryType");

export function installPerformanceEntryType() {
  definePrototypeGetter(
    PerformanceEntry.prototype,
    "entryType",
    performanceEntryType,
  );
}

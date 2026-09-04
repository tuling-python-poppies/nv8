import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
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

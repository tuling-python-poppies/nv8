import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { PerformanceEntry } from "./performance-entry-constructor.js";
import { requirePerformanceEntry } from "./performance-entry-state.js";

export const performanceEntryName = {
  performanceEntryName() {
  const value = requirePerformanceEntry(this).name;
  traceGetter("window.PerformanceEntry.prototype.name", "PerformanceEntry", value);
  return value;

  },
}.performanceEntryName;

registerNativeGetter(performanceEntryName, "name");

export function installPerformanceEntryName() {
  definePrototypeGetter(PerformanceEntry.prototype, "name", performanceEntryName);
}

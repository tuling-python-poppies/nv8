import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { Performance } from "./performance-constructor.js";
import { requirePerformanceEntry } from "./performance-entry-state.js";
import { requirePerformance } from "./performance-state.js";

export const clearResourceTimings = {
  clearResourceTimings() {
  const state = requirePerformance(this);
  state.entries = state.entries.filter(
    (entry) => requirePerformanceEntry(entry).entryType !== "resource",
  );
  traceCall(
    "window.Performance.prototype.clearResourceTimings",
    "Performance",
    [],
    undefined,
  );

  },
}.clearResourceTimings;

registerNativeFunction(clearResourceTimings, "clearResourceTimings");

export function installPerformanceClearResourceTimings() {
  definePrototypeMethod(
    Performance.prototype,
    "clearResourceTimings",
    clearResourceTimings,
  );
}

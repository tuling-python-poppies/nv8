import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { Performance } from "./performance-constructor.js";
import { requirePerformanceEntry } from "./performance-entry-state.js";
import { requirePerformance } from "./performance-state.js";

const clearResourceTimings = {
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

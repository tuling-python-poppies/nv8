import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { PerformanceEntry } from "./performance-entry-constructor.js";
import { requirePerformanceEntry } from "./performance-entry-state.js";

const performanceEntryNavigationId = {
  performanceEntryNavigationId() {
    const value = requirePerformanceEntry(this).navigationId;
    traceGetter(
      "window.PerformanceEntry.prototype.navigationId",
      "PerformanceEntry",
      value,
    );
    return value;
  },
}.performanceEntryNavigationId;

registerNativeGetter(performanceEntryNavigationId, "navigationId");

export function installPerformanceEntryNavigationId() {
  definePrototypeGetter(
    PerformanceEntry.prototype,
    "navigationId",
    performanceEntryNavigationId,
  );
}

import { traceCall } from "../../trace/trace-function.js";
import { toDOMString } from "../../webidl/conversions.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { Performance } from "./performance-constructor.js";
import { requirePerformanceEntry } from "./performance-entry-state.js";
import { requirePerformance } from "./performance-state.js";

export const getEntriesByType = {
  getEntriesByType(type) {
  const state = requirePerformance(this);
  if (arguments.length === 0) {
    throw new TypeError(
      "Failed to execute 'getEntriesByType' on 'Performance': 1 argument required.",
    );
  }
  const normalizedType = toDOMString(type);
  const result = state.entries.filter(
    (entry) => requirePerformanceEntry(entry).entryType === normalizedType,
  );
  traceCall(
    "window.Performance.prototype.getEntriesByType",
    "Performance",
    [normalizedType],
    result,
  );
  return result;

  },
}.getEntriesByType;

registerNativeFunction(getEntriesByType, "getEntriesByType");

export function installPerformanceGetEntriesByType() {
  definePrototypeMethod(
    Performance.prototype,
    "getEntriesByType",
    getEntriesByType,
  );
}

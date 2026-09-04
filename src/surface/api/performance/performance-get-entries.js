import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { Performance } from "./performance-constructor.js";
import { requirePerformanceEntry } from "./performance-entry-state.js";
import { requirePerformance } from "./performance-state.js";

export const getEntries = {
  getEntries() {
  const result = requirePerformance(this).entries
    .slice()
    .sort((left, right) => (
      requirePerformanceEntry(left).startTime
      - requirePerformanceEntry(right).startTime
    ));
  traceCall(
    "window.Performance.prototype.getEntries",
    "Performance",
    [],
    result,
  );
  return result;

  },
}.getEntries;

registerNativeFunction(getEntries, "getEntries");

export function installPerformanceGetEntries() {
  definePrototypeMethod(Performance.prototype, "getEntries", getEntries);
}

import { traceCall } from "../../../infra/trace/trace-function.js";
import { toDOMString } from "../../../engine/webidl/conversions.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { Performance } from "./performance-constructor.js";
import { requirePerformanceEntry } from "./performance-entry-state.js";
import { requirePerformance } from "./performance-state.js";

export const clearMarks = {
  clearMarks() {
  const state = requirePerformance(this);
  const name = arguments.length === 0 || arguments[0] === undefined
    ? null
    : toDOMString(arguments[0]);
  state.entries = state.entries.filter((entry) => {
    const record = requirePerformanceEntry(entry);
    return record.entryType !== "mark"
      || (name !== null && record.name !== name);
  });
  traceCall(
    "window.Performance.prototype.clearMarks",
    "Performance",
    [name],
    undefined,
  );

  },
}.clearMarks;

registerNativeFunction(clearMarks, "clearMarks");

export function installPerformanceClearMarks() {
  definePrototypeMethod(Performance.prototype, "clearMarks", clearMarks);
}

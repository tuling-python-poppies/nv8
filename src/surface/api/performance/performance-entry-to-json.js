import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { PerformanceEntry } from "./performance-entry-constructor.js";
import { requirePerformanceEntry } from "./performance-entry-state.js";

export const toJSON = {
  toJSON() {
  const state = requirePerformanceEntry(this);
  const result = {
    name: state.name,
    entryType: state.entryType,
    startTime: state.startTime,
    duration: state.duration,
  };
  traceCall(
    "window.PerformanceEntry.prototype.toJSON",
    "PerformanceEntry",
    [],
    result,
  );
  return result;

  },
}.toJSON;

registerNativeFunction(toJSON, "toJSON");

export function installPerformanceEntryToJSON() {
  definePrototypeMethod(PerformanceEntry.prototype, "toJSON", toJSON);
}

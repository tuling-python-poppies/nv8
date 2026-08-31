import { traceCall } from "../../trace/trace-function.js";
import { toDOMString } from "../../webidl/conversions.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { Performance } from "./performance-constructor.js";
import { requirePerformanceEntry } from "./performance-entry-state.js";
import { requirePerformance } from "./performance-state.js";

export const getEntriesByName = {
  getEntriesByName(name) {
  const state = requirePerformance(this);
  if (arguments.length === 0) {
    throw new TypeError(
      "Failed to execute 'getEntriesByName' on 'Performance': 1 argument required.",
    );
  }
  const normalizedName = toDOMString(name);
  const type = arguments.length > 1 && arguments[1] !== undefined
    ? toDOMString(arguments[1])
    : null;
  const result = state.entries.filter((entry) => {
    const record = requirePerformanceEntry(entry);
    return record.name === normalizedName
      && (type === null || record.entryType === type);
  });
  traceCall(
    "window.Performance.prototype.getEntriesByName",
    "Performance",
    [normalizedName, type],
    result,
  );
  return result;

  },
}.getEntriesByName;

registerNativeFunction(getEntriesByName, "getEntriesByName");

export function installPerformanceGetEntriesByName() {
  definePrototypeMethod(
    Performance.prototype,
    "getEntriesByName",
    getEntriesByName,
  );
}

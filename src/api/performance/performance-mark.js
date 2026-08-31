import { monotonicNow } from "../../scheduler/monotonic-clock.js";
import { traceCall } from "../../trace/trace-function.js";
import { toDOMString } from "../../webidl/conversions.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { cloneDetail } from "./clone-detail.js";
import { Performance } from "./performance-constructor.js";
import { createPerformanceMark } from "./performance-mark-constructor.js";
import {
  appendPerformanceEntry,
  requirePerformance,
} from "./performance-state.js";

export const mark = {
  mark(name) {
  requirePerformance(this);
  if (arguments.length === 0) {
    throw new TypeError(
      "Failed to execute 'mark' on 'Performance': 1 argument required.",
    );
  }
  const normalizedName = toDOMString(name);
  const options = arguments[1] === undefined || arguments[1] === null
    ? null
    : Object(arguments[1]);
  const startTime = options === null || options.startTime === undefined
    ? monotonicNow()
    : Number(options.startTime);
  if (!Number.isFinite(startTime) || startTime < 0) {
    throw new TypeError("A PerformanceMark cannot have a negative start time");
  }
  const detail = options === null || options.detail === undefined
    ? null
    : cloneDetail(options.detail);
  const result = createPerformanceMark(normalizedName, startTime, detail);
  appendPerformanceEntry(this, result);
  traceCall(
    "window.Performance.prototype.mark",
    "Performance",
    [normalizedName, arguments[1]],
    result,
  );
  return result;

  },
}.mark;

registerNativeFunction(mark, "mark");

export function installPerformanceMarkMethod() {
  definePrototypeMethod(Performance.prototype, "mark", mark);
}

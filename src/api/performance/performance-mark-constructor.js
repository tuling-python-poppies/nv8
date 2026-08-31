import { monotonicNow } from "../../scheduler/monotonic-clock.js";
import { traceConstruct } from "../../trace/trace-function.js";
import { toDOMString } from "../../webidl/conversions.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { cloneDetail } from "./clone-detail.js";
import { PerformanceEntry } from "./performance-entry-constructor.js";
import { initializePerformanceEntry } from "./performance-entry-state.js";
import { initializePerformanceMark } from "./performance-mark-state.js";

export function PerformanceMark(name) {
  if (new.target === undefined || arguments.length === 0) {
    throw new TypeError(
      "Failed to construct 'PerformanceMark': 1 argument required",
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
  initializePerformanceEntry(this, normalizedName, "mark", startTime, 0);
  initializePerformanceMark(this, detail);
  traceConstruct(
    "window.PerformanceMark",
    [normalizedName, arguments[1]],
    "PerformanceMark",
  );
}

Object.setPrototypeOf(PerformanceMark.prototype, PerformanceEntry.prototype);
Object.setPrototypeOf(PerformanceMark, PerformanceEntry);
registerNativeFunction(PerformanceMark, "PerformanceMark");

export function createPerformanceMark(name, startTime, detail) {
  const value = Object.create(PerformanceMark.prototype);
  initializePerformanceEntry(value, name, "mark", startTime, 0);
  initializePerformanceMark(value, cloneDetail(detail));
  return value;
}

export function installPerformanceMarkConstructor() {
  delete PerformanceMark.prototype.constructor;
  defineToStringTag(PerformanceMark.prototype, "PerformanceMark");
  defineGlobalConstructor("PerformanceMark", PerformanceMark);
}

export function installPerformanceMarkConstructorBacklink() {
  defineConstructorBacklink(PerformanceMark.prototype, PerformanceMark);
}

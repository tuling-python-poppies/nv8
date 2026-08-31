import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { cloneDetail } from "./clone-detail.js";
import { PerformanceEntry } from "./performance-entry-constructor.js";
import { initializePerformanceEntry } from "./performance-entry-state.js";
import { initializePerformanceMeasure } from "./performance-measure-state.js";

export function PerformanceMeasure() {
  throw new TypeError(
    "Failed to construct 'PerformanceMeasure': Illegal constructor",
  );
}

Object.setPrototypeOf(PerformanceMeasure.prototype, PerformanceEntry.prototype);
Object.setPrototypeOf(PerformanceMeasure, PerformanceEntry);
registerNativeFunction(PerformanceMeasure, "PerformanceMeasure");

export function createPerformanceMeasure(
  name,
  startTime,
  duration,
  detail,
) {
  const value = Object.create(PerformanceMeasure.prototype);
  initializePerformanceEntry(value, name, "measure", startTime, duration);
  initializePerformanceMeasure(value, cloneDetail(detail));
  return value;
}

export function installPerformanceMeasureConstructor() {
  delete PerformanceMeasure.prototype.constructor;
  defineToStringTag(PerformanceMeasure.prototype, "PerformanceMeasure");
  defineGlobalConstructor("PerformanceMeasure", PerformanceMeasure);
}

export function installPerformanceMeasureConstructorBacklink() {
  defineConstructorBacklink(PerformanceMeasure.prototype, PerformanceMeasure);
}

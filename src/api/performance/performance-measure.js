import { monotonicNow } from "../../scheduler/monotonic-clock.js";
import { traceCall } from "../../trace/trace-function.js";
import { toDOMString } from "../../webidl/conversions.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { cloneDetail } from "./clone-detail.js";
import { Performance } from "./performance-constructor.js";
import { requirePerformanceEntry } from "./performance-entry-state.js";
import { createPerformanceMeasure } from "./performance-measure-constructor.js";
import {
  appendPerformanceEntry,
  requirePerformance,
} from "./performance-state.js";

export const measure = {
  measure(name) {
  const state = requirePerformance(this);
  if (arguments.length === 0) {
    throw new TypeError(
      "Failed to execute 'measure' on 'Performance': 1 argument required.",
    );
  }
  const normalizedName = toDOMString(name);
  const second = arguments[1];
  const third = arguments[2];
  let startTime = 0;
  let endTime = monotonicNow();
  let detail = null;

  if (second !== undefined && second !== null && typeof second === "object") {
    const options = Object(second);
    const hasStart = options.start !== undefined;
    const hasEnd = options.end !== undefined;
    const hasDuration = options.duration !== undefined;
    startTime = hasStart ? resolveTime(state, options.start) : 0;
    if (hasEnd) {
      endTime = resolveTime(state, options.end);
    } else if (hasDuration) {
      endTime = startTime + Number(options.duration);
    }
    if (!hasStart && hasDuration && hasEnd) {
      startTime = endTime - Number(options.duration);
    }
    detail = options.detail === undefined ? null : cloneDetail(options.detail);
  } else {
    if (second !== undefined) {
      startTime = resolveMark(state, toDOMString(second));
    }
    if (third !== undefined) {
      endTime = resolveMark(state, toDOMString(third));
    }
  }

  if (
    !Number.isFinite(startTime)
    || !Number.isFinite(endTime)
    || endTime < startTime
  ) {
    throw new TypeError("Performance measure has an invalid time range");
  }
  const result = createPerformanceMeasure(
    normalizedName,
    startTime,
    endTime - startTime,
    detail,
  );
  appendPerformanceEntry(this, result);
  traceCall(
    "window.Performance.prototype.measure",
    "Performance",
    [normalizedName, second, third],
    result,
  );
  return result;

  },
}.measure;

function resolveTime(state, value) {
  return typeof value === "string"
    ? resolveMark(state, value)
    : Number(value);
}

function resolveMark(state, name) {
  for (let index = state.entries.length - 1; index >= 0; index -= 1) {
    const entry = state.entries[index];
    const record = requirePerformanceEntry(entry);
    if (record.entryType === "mark" && record.name === name) {
      return record.startTime;
    }
  }
  throw new DOMException(
    // Chromium 的 DOMException 文案统一带 `Failed to execute 'X' on 'Y': ` 前缀，
    // 缺前缀是可检测偏差（`argumentCount` 那批 244 处构造器就是同一个问题）。
    `Failed to execute 'measure' on 'Performance': `
    + `The mark '${name}' does not exist.`,
    "SyntaxError",
  );
}

registerNativeFunction(measure, "measure");

export function installPerformanceMeasureMethod() {
  definePrototypeMethod(Performance.prototype, "measure", measure);
}

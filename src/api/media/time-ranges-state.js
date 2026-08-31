import { TimeRanges } from "./time-ranges-constructor.js";

const timeRangesState = new WeakMap();

export function createTimeRanges(ranges = []) {
  const result = Object.create(TimeRanges.prototype);
  timeRangesState.set(
    result,
    ranges.map(range => [Number(range[0]), Number(range[1])]),
  );
  return result;
}

export function requireTimeRanges(value) {
  const ranges = timeRangesState.get(value);
  if (ranges === undefined) throw new TypeError("Illegal invocation");
  return ranges;
}

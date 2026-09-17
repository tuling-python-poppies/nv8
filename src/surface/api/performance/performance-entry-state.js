const performanceEntryState = new WeakMap();

export function initializePerformanceEntry(
  value,
  name,
  entryType,
  startTime,
  duration,
  extra = {},
) {
  performanceEntryState.set(value, {
    name,
    entryType,
    startTime,
    duration,
    ...extra,
  });
}

export function requirePerformanceEntry(value) {
  const state = performanceEntryState.get(value);
  if (state === undefined) {
    throw new TypeError("Illegal invocation");
  }
  return state;
}

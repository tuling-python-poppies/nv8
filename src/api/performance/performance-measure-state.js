const performanceMeasureState = new WeakMap();

export function initializePerformanceMeasure(value, detail) {
  performanceMeasureState.set(value, { detail });
}

export function requirePerformanceMeasure(value) {
  const state = performanceMeasureState.get(value);
  if (state === undefined) {
    throw new TypeError("Illegal invocation");
  }
  return state;
}

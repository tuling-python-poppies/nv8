const performanceMarkState = new WeakMap();

export function initializePerformanceMark(value, detail) {
  performanceMarkState.set(value, { detail });
}

export function requirePerformanceMark(value) {
  const state = performanceMarkState.get(value);
  if (state === undefined) {
    throw new TypeError("Illegal invocation");
  }
  return state;
}

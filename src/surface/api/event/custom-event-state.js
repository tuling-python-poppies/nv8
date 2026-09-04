const customEventState = new WeakMap();

export function initializeCustomEvent(value, detail) {
  customEventState.set(value, { detail });
}

export function requireCustomEvent(value) {
  const state = customEventState.get(value);
  if (state === undefined) {
    throw new TypeError("Illegal invocation");
  }
  return state;
}

const eventTargetState = new WeakMap();

export function initializeEventTarget(value) {
  eventTargetState.set(value, {
    listeners: new Map(),
  });
}

export function requireEventTarget(value) {
  const state = eventTargetState.get(eventTargetReceiver(value));
  if (state === undefined) {
    throw new TypeError("Illegal invocation");
  }
  return state;
}

export function isEventTarget(value) {
  return eventTargetState.has(value);
}

export function eventTargetReceiver(value) {
  return value === undefined || value === null ? globalThis : value;
}

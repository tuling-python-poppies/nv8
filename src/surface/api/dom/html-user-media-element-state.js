const state = new WeakMap();

export function initializeUserMediaElement(element) {
  state.set(element, {
    error: null,
    stream: null,
    oncancel: null,
    onerror: null,
    onstream: null,
  });
}

export function requireUserMediaElement(element) {
  const value = state.get(element);
  if (value === undefined) throw new TypeError("Illegal invocation");
  return value;
}

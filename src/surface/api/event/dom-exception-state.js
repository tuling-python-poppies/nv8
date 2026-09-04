const domExceptionState = new WeakMap();

export function initializeDOMException(value, message, name) {
  domExceptionState.set(value, { message, name });
}

export function requireDOMException(value) {
  const state = domExceptionState.get(value);
  if (state === undefined) {
    throw new TypeError("Illegal invocation");
  }
  return state;
}

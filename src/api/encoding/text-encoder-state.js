const encoderState = new WeakSet();

export function initializeTextEncoder(value) {
  encoderState.add(value);
}

export function requireTextEncoder(value) {
  if (!encoderState.has(value)) {
    throw new TypeError("Illegal invocation");
  }
}

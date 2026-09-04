const memoryState = new WeakSet();

export function initializeMemoryInfo(value) {
  memoryState.add(value);
}

export function requireMemoryInfo(value) {
  if (!memoryState.has(value)) {
    throw new TypeError("Illegal invocation");
  }
}

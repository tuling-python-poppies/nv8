const state = new WeakMap();
export function initializeOverconstrainedError(error, constraint) {
  state.set(error, `${constraint}`);
}
export function requireOverconstrainedError(error) {
  const constraint = state.get(error);
  if (constraint === undefined) throw new TypeError("Illegal invocation");
  return constraint;
}

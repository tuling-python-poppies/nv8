const state = new WeakMap();
export function initializeCookieChangeEvent(event, init) {
  state.set(event, {
    changed: Object.freeze(Array.from(init?.changed ?? [])),
    deleted: Object.freeze(Array.from(init?.deleted ?? [])),
  });
}
export function requireCookieChangeEvent(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

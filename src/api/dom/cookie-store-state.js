import { initializeEventTarget } from "../event/event-target-state.js";
const state = new WeakMap();
export function initializeCookieStore(store) {
  initializeEventTarget(store);
  state.set(store, { onchange: null });
}
export function requireCookieStore(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

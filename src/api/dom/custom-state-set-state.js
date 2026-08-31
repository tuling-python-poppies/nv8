import { CustomStateSet } from "./custom-state-set-constructor.js";

const state = new WeakMap();

export function createCustomStateSet() {
  const set = Object.create(CustomStateSet.prototype);
  state.set(set, new Set());
  return set;
}

export function requireCustomStateSet(value) {
  const set = state.get(value);
  if (set === undefined) throw new TypeError("Illegal invocation");
  return set;
}

export function normalizeCustomState(value) {
  const name = `${value}`;
  if (!/^--[A-Za-z_][A-Za-z0-9_-]*$/u.test(name)) {
    throw new DOMException("The custom state name is not valid", "SyntaxError");
  }
  return name;
}

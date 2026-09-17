import { StylePropertyMapReadOnly } from "./style-property-map-read-only-constructor.js";
const state = new WeakMap();

export function createStylePropertyMapReadOnly(entries = []) {
  const map = Object.create(StylePropertyMapReadOnly.prototype);
  state.set(map, { read: () => new Map(entries) });
  return map;
}

export function registerStylePropertyMapReadOnly(map, read) {
  state.set(map, { read });
}

export function requireStylePropertyMapReadOnly(map) {
  const record = state.get(map);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record.read();
}

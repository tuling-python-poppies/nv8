import { createCSSStyleValue } from "./css-style-value-state.js";
import { StylePropertyMap } from "./style-property-map-constructor.js";
import { registerStylePropertyMapReadOnly } from "./style-property-map-read-only-state.js";

const state = new WeakMap();

export function createStylePropertyMap(read, write) {
  const map = Object.create(StylePropertyMap.prototype);
  state.set(map, { read, write });
  registerStylePropertyMapReadOnly(map, read);
  return map;
}

export function requireStylePropertyMap(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

export function normalizeStyleMapName(name) {
  const value = `${name}`.trim();
  return value.startsWith("--") ? value : value.toLowerCase();
}

export function convertStyleMapValues(values) {
  return values.map(value => {
    if (value !== null && typeof value === "object") return value;
    return createCSSStyleValue(value);
  });
}

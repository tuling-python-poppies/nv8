import { createRealmSlot } from "../../../engine/core/state-scope.js";

// 迁移前这些是模块级状态，会跨宿主图 Realm 共享。
const customElementSlot = createRealmSlot(() => ({
  defaultRegistry: null,
}), "customElement");

function customElementState() {
  return customElementSlot.get(globalThis);
}
const state = new WeakMap();

export function initializeCustomElementRegistry(registry) {
  state.set(registry, { definitions: new Map(), waiters: new Map() });
}
export function requireCustomElementRegistry(registry) {
  const value=state.get(registry); if(value===undefined)throw new TypeError("Illegal invocation");return value;
}
export function setDefaultCustomElementRegistry(registry){customElementState().defaultRegistry=registry;}
export function defaultCustomElementRegistry(){return customElementState().defaultRegistry;}
export function validateCustomElementName(value) {
  const name=`${value}`;
  if(!/^[a-z][.0-9_a-z-]*-[.0-9_a-z-]*$/u.test(name)) {
    throw new DOMException("The custom element name is invalid","SyntaxError");
  }
  return name;
}

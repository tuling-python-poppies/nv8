import { createValidityState } from "./validity-state-constructor.js";

const objectElementState = new WeakMap();

export function initializeObjectElement(element) {
  const state = {
    customValidity: "",
    validity: null,
  };
  objectElementState.set(element, state);
  state.validity = createValidityState(() => ({
    customError: state.customValidity !== "",
  }));
}

export function requireObjectElement(element) {
  const state = objectElementState.get(element);
  if (state === undefined) throw new TypeError("Illegal invocation");
  return state;
}

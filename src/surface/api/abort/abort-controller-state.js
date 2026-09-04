import { createAbortSignal } from "./abort-signal-state.js";

const controllerState = new WeakMap();

export function initializeAbortController(value) {
  controllerState.set(value, {
    signal: createAbortSignal(),
  });
}

export function requireAbortController(value) {
  const state = controllerState.get(value);
  if (state === undefined) {
    throw new TypeError("Illegal invocation");
  }
  return state;
}

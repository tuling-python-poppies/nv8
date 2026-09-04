import { createDOMTokenList } from "./dom-token-list-state.js";

const fencedFrameElementState = new WeakMap();

export function initializeFencedFrameElement(element) {
  fencedFrameElementState.set(element, {
    sandbox: createDOMTokenList(element, "sandbox"),
    config: null,
  });
}

export function requireFencedFrameElement(element) {
  const state = fencedFrameElementState.get(element);
  if (state === undefined) throw new TypeError("Illegal invocation");
  return state;
}

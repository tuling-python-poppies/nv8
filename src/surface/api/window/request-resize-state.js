import { createRealmSlot } from "../../../engine/core/state-scope.js";

const requestResizeSlot = createRealmSlot(() => ({
  callback: null,
}), "request-resize");

export function configureRequestResize(callback) {
  requestResizeSlot.get(globalThis).callback = typeof callback === "function"
    ? callback
    : null;
}

export function requestResizeCallback() {
  return requestResizeSlot.get(globalThis).callback;
}

const frameSetState = new WeakMap();

export function initializeFrameSetElement(element) {
  frameSetState.set(element, { handlers: new Map() });
}

export function requireFrameSetElement(element) {
  const state = frameSetState.get(element);
  if (state === undefined) throw new TypeError("Illegal invocation");
  return state;
}

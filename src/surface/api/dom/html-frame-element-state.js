const frameElements = new WeakSet();

export function initializeFrameElement(element) {
  frameElements.add(element);
}

export function requireFrameElement(element) {
  if (!frameElements.has(element)) throw new TypeError("Illegal invocation");
}

import {
  createDocumentFragment,
} from "./document-fragment-constructor.js";

const templateState = new WeakMap();

export function initializeTemplate(element, ownerDocument) {
  templateState.set(element, {
    content: createDocumentFragment(ownerDocument),
    shadowRootMode: "",
    shadowRootDelegatesFocus: false,
    shadowRootClonable: false,
    shadowRootSerializable: false,
    shadowRootCustomElementRegistry: null,
    htmlFor: "",
  });
}

export function requireTemplate(element) {
  const state = templateState.get(element);
  if (state === undefined) {
    throw new TypeError("Illegal invocation");
  }
  return state;
}

export function isTemplate(element) {
  return templateState.has(element);
}

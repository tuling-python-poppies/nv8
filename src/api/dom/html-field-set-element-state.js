import { createHTMLCollection } from "./html-collection-state.js";
import { createValidityState } from "./validity-state-constructor.js";
import { descendants } from "./node-state.js";

const fieldSetState = new WeakMap();
const listedNames = new Set([
  "button",
  "fieldset",
  "input",
  "object",
  "output",
  "select",
  "textarea",
]);

export function initializeFieldSet(fieldSet) {
  const state = {
    customValidity: "",
    elements: null,
    validity: null,
  };
  fieldSetState.set(fieldSet, state);
  state.elements = createHTMLCollection(
    () => descendants(fieldSet).filter(
      element => listedNames.has(element.localName),
    ),
  );
  state.validity = createValidityState(() => ({
    customError: state.customValidity !== "",
  }));
}

export function requireFieldSet(fieldSet) {
  const state = fieldSetState.get(fieldSet);
  if (state === undefined) {
    throw new TypeError("Illegal invocation");
  }
  return state;
}

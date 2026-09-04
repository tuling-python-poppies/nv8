import { createDOMTokenList } from "./dom-token-list-state.js";
import { createHTMLFormControlsCollection } from "./html-form-controls-collection-state.js";
import { formOwnerOf } from "./form-association.js";
import {
  descendants,
  ELEMENT_NODE,
  requireNode,
  rootOf,
} from "./node-state.js";

const formState = new WeakMap();
const listedNames = new Set([
  "button",
  "fieldset",
  "input",
  "object",
  "output",
  "select",
  "textarea",
]);

export function initializeForm(form) {
  const state = {
    relList: createDOMTokenList(form, "rel"),
    elements: null,
    submitCount: 0,
    resetCount: 0,
  };
  formState.set(form, state);
  state.elements = createHTMLFormControlsCollection(
    () => formControls(form),
  );
}

export function requireForm(form) {
  const state = formState.get(form);
  if (state === undefined) {
    throw new TypeError("Illegal invocation");
  }
  return state;
}

export function formControls(form) {
  requireForm(form);
  const root = rootOf(form);
  return [root, ...descendants(root)].filter(candidate => (
    requireNode(candidate).nodeType === ELEMENT_NODE
    && listedNames.has(candidate.localName)
    && formOwnerOf(candidate) === form
  ));
}

export function normalizedAutocomplete(form) {
  requireForm(form);
  return form.getAttribute("autocomplete")?.toLowerCase() === "off"
    ? "off"
    : "on";
}

export function normalizedEnctype(form) {
  requireForm(form);
  const value = form.getAttribute("enctype")?.toLowerCase();
  return value === "multipart/form-data" || value === "text/plain"
    ? value
    : "application/x-www-form-urlencoded";
}

export function normalizedMethod(form) {
  requireForm(form);
  const value = form.getAttribute("method")?.toLowerCase();
  return value === "post" || value === "dialog" ? value : "get";
}

export function controlsAreValid(form, report = false) {
  let valid = true;
  for (const control of formControls(form)) {
    const callback = report ? control.reportValidity : control.checkValidity;
    if (typeof callback === "function" && !Reflect.apply(callback, control, [])) {
      valid = false;
    }
  }
  return valid;
}

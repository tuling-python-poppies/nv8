import { documentElements } from "./document-record.js";
import { labelControl } from "./form-association.js";
import { isNode, requireNode, ELEMENT_NODE } from "./node-state.js";
import { createNodeList } from "./node-list-state.js";
import { createValidityState } from "./validity-state-constructor.js";

const buttonState = new WeakMap();

export function initializeButton(button) {
  const state = {
    customValidity: "",
    validity: null,
    labels: null,
    popoverTargetElement: null,
    commandForElement: null,
    interestForElement: null,
  };
  buttonState.set(button, state);
  state.validity = createValidityState(() => ({
    customError: state.customValidity !== "",
  }));
  state.labels = createNodeList(
    () => documentElements(button.ownerDocument).filter(
      element => element.localName === "label"
        && labelControl(element) === button,
    ),
    true,
  );
}

export function requireButton(button) {
  const state = buttonState.get(button);
  if (state === undefined) {
    throw new TypeError("Illegal invocation");
  }
  return state;
}

export function normalizedButtonType(button) {
  requireButton(button);
  const value = button.getAttribute("type")?.toLowerCase();
  return value === "reset" || value === "button" ? value : "submit";
}

export function buttonWillValidate(button) {
  return !button.disabled && normalizedButtonType(button) === "submit";
}

export function normalizeTarget(value) {
  if (value === null || value === undefined) {
    return null;
  }
  if (!isNode(value) || requireNode(value).nodeType !== ELEMENT_NODE) {
    throw new TypeError("The target must be an Element or null");
  }
  return value;
}

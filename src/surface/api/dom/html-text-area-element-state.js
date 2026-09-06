import { documentElements } from "./document-record.js";
import { labelControl } from "./form-association.js";
import { createNodeList } from "./node-list-state.js";
import { createValidityState } from "./validity-state-constructor.js";

const textAreaState = new WeakMap();

export function initializeTextArea(textArea) {
  const state = {
    value: "",
    valueDirty: false,
    selectionStart: 0,
    selectionEnd: 0,
    selectionDirection: "none",
    customValidity: "",
    validity: null,
    labels: null,
  };
  textAreaState.set(textArea, state);
  state.validity = createValidityState(() => textAreaValidityFlags(textArea));
  state.labels = createNodeList(
    () => documentElements(textArea.ownerDocument).filter(
      element => element.localName === "label"
        && labelControl(element) === textArea,
    ),
    true,
  );
}

export function textAreaValue(textArea) {
  return requireTextArea(textArea).value;
}

export function requireTextArea(textArea) {
  const state = textAreaState.get(textArea);
  if (state === undefined) {
    throw new TypeError("Illegal invocation");
  }
  if (!state.valueDirty) {
    state.value = textArea.textContent;
  }
  return state;
}

export function setTextAreaValue(textArea, value, dirty = true) {
  const state = requireTextArea(textArea);
  state.value = `${value}`;
  state.valueDirty = dirty;
  const end = state.value.length;
  state.selectionStart = end;
  state.selectionEnd = end;
  state.selectionDirection = "none";
}

export function textAreaWillValidate(textArea) {
  requireTextArea(textArea);
  return !textArea.disabled && !textArea.readOnly;
}

export function textAreaValidityFlags(textArea) {
  const state = requireTextArea(textArea);
  const length = state.value.length;
  return {
    valueMissing: textArea.required && state.value === "",
    tooLong: textArea.maxLength >= 0 && length > textArea.maxLength,
    tooShort: textArea.minLength >= 0
      && state.value !== ""
      && length < textArea.minLength,
    customError: state.customValidity !== "",
  };
}

export function textAreaIsValid(textArea) {
  const flags = textAreaValidityFlags(textArea);
  return !flags.valueMissing
    && !flags.tooLong
    && !flags.tooShort
    && !flags.customError;
}

export function resetTextArea(textArea) {
  setTextAreaValue(textArea, textArea.textContent, false);
}

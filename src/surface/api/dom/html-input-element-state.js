import { documentElements } from "./document-record.js";
import { labelControl, formOwnerOf } from "./form-association.js";
import { createNodeList } from "./node-list-state.js";
import { createValidityState } from "./validity-state-constructor.js";
import { createFileList } from "../file/file-list-state.js";

const inputState = new WeakMap();
const inputTypes = new Set([
  "button", "checkbox", "color", "date", "datetime-local", "email",
  "file", "hidden", "image", "month", "number", "password", "radio",
  "range", "reset", "search", "submit", "tel", "text", "time", "url",
  "week",
]);

export function initializeInput(input) {
  const state = {
    checked: false,
    checkedDirty: false,
    indeterminate: false,
    value: "",
    valueDirty: false,
    files: createFileList(),
    selectionStart: 0,
    selectionEnd: 0,
    selectionDirection: "none",
    customValidity: "",
    validity: null,
    labels: null,
    popoverTargetElement: null,
    popoverTargetAction: "toggle",
    pickerOpen: false,
  };
  inputState.set(input, state);
  state.validity = createValidityState(() => inputValidityFlags(input));
  state.labels = createNodeList(
    () => documentElements(input.ownerDocument).filter(
      element => element.localName === "label" && labelControl(element) === input,
    ),
    true,
  );
}

export function inputValue(input) {
  return requireInput(input).value;
}

export function requireInput(input) {
  const state = inputState.get(input);
  if (state === undefined) throw new TypeError("Illegal invocation");
  if (!state.valueDirty) state.value = input.getAttribute("value") ?? "";
  if (!state.checkedDirty) state.checked = input.hasAttribute("checked");
  return state;
}

export function normalizedInputType(input) {
  requireInput(input);
  const type = input.getAttribute("type")?.toLowerCase() ?? "";
  return inputTypes.has(type) ? type : "text";
}

export function sanitizeInputValue(input, value) {
  const type = normalizedInputType(input);
  const text = `${value}`;
  if (type === "number" || type === "range") {
    return text === "" || Number.isFinite(Number(text)) ? text : "";
  }
  if (type === "date") {
    return /^\d{4,}-\d{2}-\d{2}$/u.test(text)
      && Number.isFinite(Date.parse(`${text}T00:00:00Z`)) ? text : "";
  }
  return text;
}

export function setInputValue(input, value, dirty = true) {
  const state = requireInput(input);
  if (normalizedInputType(input) === "file" && `${value}` !== "") {
    throw new DOMException("A file input may only be set to the empty string", "InvalidStateError");
  }
  state.value = sanitizeInputValue(input, value);
  state.valueDirty = dirty;
  state.selectionStart = state.value.length;
  state.selectionEnd = state.value.length;
  state.selectionDirection = "none";
}

export function setInputChecked(input, value, dirty = true) {
  const state = requireInput(input);
  state.checked = Boolean(value);
  state.checkedDirty = dirty;
  if (
    state.checked
    && normalizedInputType(input) === "radio"
    && input.name !== ""
  ) {
    for (const candidate of documentElements(input.ownerDocument)) {
      if (
        candidate !== input
        && candidate.localName === "input"
        && normalizedInputType(candidate) === "radio"
        && candidate.name === input.name
        && formOwnerOf(candidate) === formOwnerOf(input)
      ) {
        const candidateState = requireInput(candidate);
        candidateState.checked = false;
        candidateState.checkedDirty = true;
      }
    }
  }
}

export function inputWillValidate(input) {
  const type = normalizedInputType(input);
  return !input.disabled && !["hidden", "button", "reset"].includes(type);
}

export function inputNumericValue(input) {
  const state = requireInput(input);
  const type = normalizedInputType(input);
  if (type === "date") {
    const value = Date.parse(`${state.value}T00:00:00Z`);
    return Number.isFinite(value) ? value : Number.NaN;
  }
  return type === "number" || type === "range"
    ? Number.parseFloat(state.value)
    : Number.NaN;
}

export function inputValidityFlags(input) {
  const state = requireInput(input);
  const type = normalizedInputType(input);
  const number = inputNumericValue(input);
  const min = Number.parseFloat(input.min);
  const max = Number.parseFloat(input.max);
  const step = Number.parseFloat(input.step);
  let patternMismatch = false;
  if (input.pattern !== "" && state.value !== "") {
    try {
      patternMismatch = !(new RegExp(`^(?:${input.pattern})$`, "u")).test(state.value);
    } catch {
      patternMismatch = false;
    }
  }
  return {
    valueMissing: input.required && (
      type === "checkbox" || type === "radio" ? !state.checked : state.value === ""
    ),
    typeMismatch: state.value !== "" && (
      type === "email" ? !/^[^@\s]+@[^@\s]+$/u.test(state.value)
        : type === "url" ? !/^[a-z][a-z0-9+.-]*:\/\//iu.test(state.value)
          : false
    ),
    patternMismatch,
    tooLong: input.maxLength >= 0 && state.value.length > input.maxLength,
    tooShort: input.minLength >= 0
      && state.value !== "" && state.value.length < input.minLength,
    rangeUnderflow: Number.isFinite(number) && Number.isFinite(min) && number < min,
    rangeOverflow: Number.isFinite(number) && Number.isFinite(max) && number > max,
    stepMismatch: Number.isFinite(number) && Number.isFinite(step) && step > 0
      && Math.abs((number - (Number.isFinite(min) ? min : 0)) / step
        - Math.round((number - (Number.isFinite(min) ? min : 0)) / step)) > 1e-9,
    customError: state.customValidity !== "",
  };
}

export function inputIsValid(input) {
  return Object.values(inputValidityFlags(input)).every(value => !value);
}

export function resetInput(input) {
  const state = requireInput(input);
  state.valueDirty = false;
  state.checkedDirty = false;
  state.indeterminate = false;
  requireInput(input);
  state.selectionStart = state.value.length;
  state.selectionEnd = state.value.length;
  state.selectionDirection = "none";
}

import { createCustomStateSet } from "./custom-state-set-state.js";
import { documentElements } from "./document-record.js";
import { elementShadowRoot } from "./element-state.js";
import { formOwnerOf, labelControl } from "./form-association.js";
import { ElementInternals } from "./element-internals-constructor.js";
import { createNodeList } from "./node-list-state.js";
import { createValidityState } from "./validity-state-constructor.js";

const state = new WeakMap();
const validityNames = [
  "valueMissing",
  "typeMismatch",
  "patternMismatch",
  "tooLong",
  "tooShort",
  "rangeUnderflow",
  "rangeOverflow",
  "stepMismatch",
  "badInput",
  "customError",
];

export function createElementInternals(target) {
  const internals = Object.create(ElementInternals.prototype);
  const record = {
    target,
    flags: {},
    validationMessage: "",
    formValue: null,
    formState: null,
    aria: new Map(),
    states: createCustomStateSet(),
    validity: null,
    labels: null,
  };
  record.validity = createValidityState(() => record.flags);
  record.labels = createNodeList(
    () => documentElements(target.ownerDocument).filter(
      element => element.localName === "label" && labelControl(element) === target,
    ),
    true,
  );
  state.set(internals, record);
  return internals;
}

export function requireElementInternals(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

export function internalsForm(record) {
  return formOwnerOf(record.target);
}

export function internalsShadowRoot(record) {
  return elementShadowRoot(record.target);
}

export function setInternalsValidity(record, flags, message = "") {
  if (flags === null || typeof flags !== "object") {
    throw new TypeError("Validity flags must be an object");
  }
  const normalized = {};
  for (const name of validityNames) {
    if (Boolean(flags[name])) normalized[name] = true;
  }
  const invalid = Object.keys(normalized).length > 0;
  const text = `${message}`;
  if (invalid && text === "") {
    throw new TypeError("An invalid state requires a validation message");
  }
  record.flags = normalized;
  record.validationMessage = invalid ? text : "";
}

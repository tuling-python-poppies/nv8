import { createDOMTokenList } from "./dom-token-list-state.js";
import { documentElements } from "./document-record.js";
import { labelControl } from "./form-association.js";
import { createNodeList } from "./node-list-state.js";
import { createValidityState } from "./validity-state-constructor.js";

const outputState = new WeakMap();

export function initializeOutput(output) {
  const state = {
    htmlFor: createDOMTokenList(output, "for"),
    defaultValue: "",
    value: "",
    valueDirty: false,
    customValidity: "",
    validity: null,
    labels: null,
  };
  outputState.set(output, state);
  state.validity = createValidityState(() => ({
    customError: state.customValidity !== "",
  }));
  state.labels = createNodeList(
    () => documentElements(output.ownerDocument).filter(
      element => element.localName === "label"
        && labelControl(element) === output,
    ),
    true,
  );
}

export function requireOutput(output) {
  const state = outputState.get(output);
  if (state === undefined) {
    throw new TypeError("Illegal invocation");
  }
  if (!state.valueDirty) {
    state.defaultValue = output.textContent;
    state.value = state.defaultValue;
  }
  return state;
}

export function resetOutput(output) {
  const state = requireOutput(output);
  state.valueDirty = false;
  state.value = state.defaultValue;
  output.textContent = state.defaultValue;
}

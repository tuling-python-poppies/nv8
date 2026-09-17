import { documentElements } from "./document-record.js";
import { createHTMLCollection } from "./html-collection-state.js";
import {
  createHTMLOptionsCollection,
  selectOptions,
} from "./html-options-collection-state.js";
import {
  configureOptionSelectedness,
  setOptionSelected,
} from "./html-option-element-state.js";
import { labelControl } from "./form-association.js";
import { createNodeList } from "./node-list-state.js";
import { createValidityState } from "./validity-state-constructor.js";

const selectState = new WeakMap();

export function initializeSelect(select) {
  const state = {
    options: null,
    selectedOptions: null,
    labels: null,
    validity: null,
    customValidity: "",
    selectionExplicit: false,
    pickerOpen: false,
  };
  selectState.set(select, state);
  state.options = createHTMLOptionsCollection(select);
  state.selectedOptions = createHTMLCollection(
    () => {
      normalizeSelectSelection(select);
      return selectOptions(select).filter(option => option.selected);
    },
  );
  state.labels = createNodeList(
    () => documentElements(select.ownerDocument).filter(
      element => element.localName === "label"
        && labelControl(element) === select,
    ),
    true,
  );
  state.validity = createValidityState(() => selectValidityFlags(select));
}

export function requireSelect(select) {
  const state = selectState.get(select);
  if (state === undefined) {
    throw new TypeError("Illegal invocation");
  }
  return state;
}

function normalizeSelectSelection(select) {
  const state = requireSelect(select);
  const options = selectOptions(select);
  if (select.multiple) {
    return options;
  }
  const selected = options.filter(option => option.selected);
  if (selected.length > 1) {
    for (const option of selected.slice(1)) {
      setOptionSelected(option, false);
    }
  } else if (
    selected.length === 0
    && !state.selectionExplicit
    && options.length !== 0
  ) {
    setOptionSelected(options[0], true);
  }
  return options;
}

export function selectSelectedIndex(select) {
  return normalizeSelectSelection(select).findIndex(option => option.selected);
}

export function setSelectSelectedIndex(select, value) {
  const state = requireSelect(select);
  const index = Number(value) >> 0;
  state.selectionExplicit = true;
  const options = selectOptions(select);
  for (let cursor = 0; cursor < options.length; cursor += 1) {
    setOptionSelected(options[cursor], cursor === index);
  }
}

export function optionSelectionChanged(option, selected) {
  const select = option.closest("select");
  if (select === null || !selectState.has(select)) {
    return;
  }
  const state = requireSelect(select);
  state.selectionExplicit = true;
  if (selected && !select.multiple) {
    for (const candidate of selectOptions(select)) {
      if (candidate !== option) {
        setOptionSelected(candidate, false);
      }
    }
  }
}

export function selectValidityFlags(select) {
  const state = requireSelect(select);
  const valueMissing = select.required && select.value === "";
  return {
    valueMissing,
    customError: state.customValidity !== "",
  };
}

export function selectIsValid(select) {
  const flags = selectValidityFlags(select);
  return !flags.valueMissing && !flags.customError;
}

export function resetSelect(select) {
  const state = requireSelect(select);
  state.selectionExplicit = false;
  for (const option of selectOptions(select)) {
    configureOptionSelectedness(
      option,
      option.defaultSelected,
      option.defaultSelected,
    );
  }
  normalizeSelectSelection(select);
}

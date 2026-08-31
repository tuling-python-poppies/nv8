const optionState = new WeakMap();

export function initializeOption(option) {
  optionState.set(option, {
    selected: false,
    dirty: false,
  });
}

export function requireOption(option) {
  const state = optionState.get(option);
  if (state === undefined) {
    throw new TypeError("Illegal invocation");
  }
  return state;
}

export function configureOptionSelectedness(option, selected, defaultSelected) {
  const state = requireOption(option);
  state.selected = selected;
  state.dirty = selected !== defaultSelected;
}

export function setOptionSelected(option, selected) {
  const state = requireOption(option);
  state.selected = Boolean(selected);
  state.dirty = true;
}

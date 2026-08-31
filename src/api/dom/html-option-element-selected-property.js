import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { getAttributeValue } from "./element-state.js";
import { requireOption } from "./html-option-element-state.js";
import { optionSelectionChanged } from "./html-select-element-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get selected() {
    const state = requireOption(this);
    const result = state.dirty
      ? state.selected
      : getAttributeValue(this, "selected") !== null;
    traceGetter("window.HTMLOptionElement.prototype.selected", "HTMLOptionElement", result);
    return result;
  },
  set selected(value) {
    const state = requireOption(this);
    state.selected = Boolean(value);
    state.dirty = true;
    optionSelectionChanged(this, state.selected);
  },
}, "selected");
export const selected = descriptor.get;
export const setSelected = descriptor.set;
registerNativeGetter(selected, "selected");
registerNativeFunction(setSelected, "set selected");

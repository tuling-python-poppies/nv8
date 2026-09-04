import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { selectOptions } from "./html-options-collection-state.js";
import {
  selectSelectedIndex,
  setSelectSelectedIndex,
} from "./html-select-element-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get value() {
    const index = selectSelectedIndex(this);
    const result = index < 0 ? "" : selectOptions(this)[index].value;
    traceGetter("window.HTMLSelectElement.prototype.value", "HTMLSelectElement", result);
    return result;
  },
  set value(value) {
    const normalized = `${value}`;
    const index = selectOptions(this).findIndex(
      option => option.value === normalized,
    );
    setSelectSelectedIndex(this, index);
  },
}, "value");
export const value = descriptor.get;
export const setValue = descriptor.set;
registerNativeGetter(value, "value");
registerNativeFunction(setValue, "set value");

import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { requireInput, setInputChecked } from "./html-input-element-state.js";

const descriptor = Object.getOwnPropertyDescriptor({
  get checked() {
    const result = requireInput(this).checked;
    traceGetter("window.HTMLInputElement.prototype.checked", "HTMLInputElement", result);
    return result;
  },
  set checked(value) {
    setInputChecked(this, value);
  },
}, "checked");
export const checked = descriptor.get;
export const setChecked = descriptor.set;
registerNativeGetter(checked, "checked");
registerNativeFunction(setChecked, "set checked");

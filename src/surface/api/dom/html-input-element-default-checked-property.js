import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireInput } from "./html-input-element-state.js";

const descriptor = Object.getOwnPropertyDescriptor({
  get defaultChecked() {
    requireInput(this);
    const result = this.hasAttribute("checked");
    traceGetter("window.HTMLInputElement.prototype.defaultChecked", "HTMLInputElement", result);
    return result;
  },
  set defaultChecked(value) {
    const state = requireInput(this);
    if (Boolean(value)) this.setAttribute("checked", "");
    else this.removeAttribute("checked");
    if (!state.checkedDirty) state.checked = Boolean(value);
  },
}, "defaultChecked");
export const defaultChecked = descriptor.get;
export const setDefaultChecked = descriptor.set;
registerNativeGetter(defaultChecked, "defaultChecked");
registerNativeFunction(setDefaultChecked, "set defaultChecked");

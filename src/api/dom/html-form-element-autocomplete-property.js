import { traceGetter } from "../../trace/trace-accessor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../webidl/native-function.js";
import {
  normalizedAutocomplete,
  requireForm,
} from "./html-form-element-state.js";

const descriptor = Object.getOwnPropertyDescriptor({
  get autocomplete() {
    const result = normalizedAutocomplete(this);
    traceGetter("window.HTMLFormElement.prototype.autocomplete", "HTMLFormElement", result);
    return result;
  },
  set autocomplete(value) {
    requireForm(this);
    this.setAttribute("autocomplete", `${value}`.toLowerCase() === "off" ? "off" : "on");
  },
}, "autocomplete");
export const autocomplete = descriptor.get;
export const setAutocomplete = descriptor.set;
registerNativeGetter(autocomplete, "autocomplete");
registerNativeFunction(setAutocomplete, "set autocomplete");

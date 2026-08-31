import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { requireButton } from "./html-button-element-state.js";
function normalize(value) {
  const text = `${value}`.toLowerCase();
  return text === "multipart/form-data" || text === "text/plain"
    ? text
    : "application/x-www-form-urlencoded";
}
const descriptor = Object.getOwnPropertyDescriptor({
  get formEnctype() {
    requireButton(this);
    const result = normalize(this.getAttribute("formenctype") ?? "");
    traceGetter("window.HTMLButtonElement.prototype.formEnctype", "HTMLButtonElement", result);
    return result;
  },
  set formEnctype(value) {
    requireButton(this);
    this.setAttribute("formenctype", normalize(value));
  },
}, "formEnctype");
export const formEnctype = descriptor.get;
export const setFormEnctype = descriptor.set;
registerNativeGetter(formEnctype, "formEnctype");
registerNativeFunction(setFormEnctype, "set formEnctype");

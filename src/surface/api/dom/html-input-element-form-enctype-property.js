import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireInput } from "./html-input-element-state.js";
function normalize(value) {
  const text = `${value}`.toLowerCase();
  return text === "multipart/form-data" || text === "text/plain"
    ? text : "application/x-www-form-urlencoded";
}
const descriptor = Object.getOwnPropertyDescriptor({
  get formEnctype() {
    requireInput(this);
    const result = normalize(this.getAttribute("formenctype") ?? "");
    traceGetter("window.HTMLInputElement.prototype.formEnctype", "HTMLInputElement", result);
    return result;
  },
  set formEnctype(value) {
    requireInput(this);
    this.setAttribute("formenctype", normalize(value));
  },
}, "formEnctype");
export const formEnctype = descriptor.get;
export const setFormEnctype = descriptor.set;
registerNativeGetter(formEnctype, "formEnctype");
registerNativeFunction(setFormEnctype, "set formEnctype");

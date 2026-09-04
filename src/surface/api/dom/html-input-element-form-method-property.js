import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireInput } from "./html-input-element-state.js";
function normalize(value) {
  const text = `${value}`.toLowerCase();
  return text === "post" || text === "dialog" ? text : "get";
}
const descriptor = Object.getOwnPropertyDescriptor({
  get formMethod() {
    requireInput(this);
    const result = normalize(this.getAttribute("formmethod") ?? "");
    traceGetter("window.HTMLInputElement.prototype.formMethod", "HTMLInputElement", result);
    return result;
  },
  set formMethod(value) {
    requireInput(this);
    this.setAttribute("formmethod", normalize(value));
  },
}, "formMethod");
export const formMethod = descriptor.get;
export const setFormMethod = descriptor.set;
registerNativeGetter(formMethod, "formMethod");
registerNativeFunction(setFormMethod, "set formMethod");

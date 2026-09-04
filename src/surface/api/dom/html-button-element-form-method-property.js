import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireButton } from "./html-button-element-state.js";
function normalize(value) {
  const text = `${value}`.toLowerCase();
  return text === "post" || text === "dialog" ? text : "get";
}
const descriptor = Object.getOwnPropertyDescriptor({
  get formMethod() {
    requireButton(this);
    const result = normalize(this.getAttribute("formmethod") ?? "");
    traceGetter("window.HTMLButtonElement.prototype.formMethod", "HTMLButtonElement", result);
    return result;
  },
  set formMethod(value) {
    requireButton(this);
    this.setAttribute("formmethod", normalize(value));
  },
}, "formMethod");
export const formMethod = descriptor.get;
export const setFormMethod = descriptor.set;
registerNativeGetter(formMethod, "formMethod");
registerNativeFunction(setFormMethod, "set formMethod");

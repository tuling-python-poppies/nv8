import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireInput } from "./html-input-element-state.js";
export const list = Object.getOwnPropertyDescriptor({
  get list() {
    requireInput(this);
    const id = this.getAttribute("list");
    const candidate = id ? this.ownerDocument?.getElementById(id) ?? null : null;
    const result = candidate?.localName === "datalist" ? candidate : null;
    traceGetter("window.HTMLInputElement.prototype.list", "HTMLInputElement", result);
    return result;
  },
}, "list").get;
registerNativeGetter(list, "list");

import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireSelect } from "./html-select-element-state.js";
export const type = Object.getOwnPropertyDescriptor({
  get type() {
    requireSelect(this);
    const result = this.multiple ? "select-multiple" : "select-one";
    traceGetter("window.HTMLSelectElement.prototype.type", "HTMLSelectElement", result);
    return result;
  },
}, "type").get;
registerNativeGetter(type, "type");

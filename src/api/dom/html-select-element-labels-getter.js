import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireSelect } from "./html-select-element-state.js";
export const labels = Object.getOwnPropertyDescriptor({
  get labels() {
    const result = requireSelect(this).labels;
    traceGetter("window.HTMLSelectElement.prototype.labels", "HTMLSelectElement", result);
    return result;
  },
}, "labels").get;
registerNativeGetter(labels, "labels");

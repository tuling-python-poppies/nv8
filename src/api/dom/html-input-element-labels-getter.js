import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireInput } from "./html-input-element-state.js";
export const labels = Object.getOwnPropertyDescriptor({
  get labels() {
    const result = requireInput(this).labels;
    traceGetter("window.HTMLInputElement.prototype.labels", "HTMLInputElement", result);
    return result;
  },
}, "labels").get;
registerNativeGetter(labels, "labels");

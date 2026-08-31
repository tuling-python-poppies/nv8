import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireOutput } from "./html-output-element-state.js";

export const labels = Object.getOwnPropertyDescriptor({
  get labels() {
    const result = requireOutput(this).labels;
    traceGetter("window.HTMLOutputElement.prototype.labels", "HTMLOutputElement", result);
    return result;
  },
}, "labels").get;
registerNativeGetter(labels, "labels");

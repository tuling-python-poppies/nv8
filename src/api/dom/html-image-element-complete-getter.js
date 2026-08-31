import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireElement } from "./element-state.js";
export const complete = Object.getOwnPropertyDescriptor({
  get complete() {
    requireElement(this);
    const result = true;
    traceGetter("window.HTMLImageElement.prototype.complete", "HTMLImageElement", result);
    return result;
  },
}, "complete").get;
registerNativeGetter(complete, "complete");

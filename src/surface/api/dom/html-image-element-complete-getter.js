import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
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

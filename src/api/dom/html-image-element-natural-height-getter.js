import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireElement } from "./element-state.js";
export const naturalHeight = Object.getOwnPropertyDescriptor({
  get naturalHeight() {
    requireElement(this);
    const result = 0;
    traceGetter("window.HTMLImageElement.prototype.naturalHeight", "HTMLImageElement", result);
    return result;
  },
}, "naturalHeight").get;
registerNativeGetter(naturalHeight, "naturalHeight");

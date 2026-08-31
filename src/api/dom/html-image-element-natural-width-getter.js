import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireElement } from "./element-state.js";
export const naturalWidth = Object.getOwnPropertyDescriptor({
  get naturalWidth() {
    requireElement(this);
    const result = 0;
    traceGetter("window.HTMLImageElement.prototype.naturalWidth", "HTMLImageElement", result);
    return result;
  },
}, "naturalWidth").get;
registerNativeGetter(naturalWidth, "naturalWidth");

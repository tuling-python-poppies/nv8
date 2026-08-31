import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireElement } from "./element-state.js";
export const x = Object.getOwnPropertyDescriptor({
  get x() {
    requireElement(this);
    const result = 0;
    traceGetter("window.HTMLImageElement.prototype.x", "HTMLImageElement", result);
    return result;
  },
}, "x").get;
registerNativeGetter(x, "x");

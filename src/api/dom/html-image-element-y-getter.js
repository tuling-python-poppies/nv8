import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireElement } from "./element-state.js";
export const y = Object.getOwnPropertyDescriptor({
  get y() {
    requireElement(this);
    const result = 0;
    traceGetter("window.HTMLImageElement.prototype.y", "HTMLImageElement", result);
    return result;
  },
}, "y").get;
registerNativeGetter(y, "y");

import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireCustomStateSet } from "./custom-state-set-state.js";

export const size = Object.getOwnPropertyDescriptor({
  get size() {
    const result = requireCustomStateSet(this).size;
    traceGetter("window.CustomStateSet.prototype.size", "CustomStateSet", result);
    return result;
  },
}, "size").get;
registerNativeGetter(size, "size");

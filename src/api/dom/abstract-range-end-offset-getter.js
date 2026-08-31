import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireRange } from "./range-state.js";

export const endOffset = Object.getOwnPropertyDescriptor({
  get endOffset() {
    const value = requireRange(this).endOffset;
    traceGetter("window.AbstractRange.prototype.endOffset", "AbstractRange", value);
    return value;
  },
}, "endOffset").get;
registerNativeGetter(endOffset, "endOffset");

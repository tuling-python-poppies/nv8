import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireRange } from "./range-state.js";

export const startOffset = Object.getOwnPropertyDescriptor({
  get startOffset() {
    const value = requireRange(this).startOffset;
    traceGetter("window.AbstractRange.prototype.startOffset", "AbstractRange", value);
    return value;
  },
}, "startOffset").get;
registerNativeGetter(startOffset, "startOffset");

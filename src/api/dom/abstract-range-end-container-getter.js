import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireRange } from "./range-state.js";

export const endContainer = Object.getOwnPropertyDescriptor({
  get endContainer() {
    const value = requireRange(this).endContainer;
    traceGetter("window.AbstractRange.prototype.endContainer", "AbstractRange", value);
    return value;
  },
}, "endContainer").get;
registerNativeGetter(endContainer, "endContainer");

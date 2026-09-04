import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireRange } from "./range-state.js";

export const startContainer = Object.getOwnPropertyDescriptor({
  get startContainer() {
    const value = requireRange(this).startContainer;
    traceGetter("window.AbstractRange.prototype.startContainer", "AbstractRange", value);
    return value;
  },
}, "startContainer").get;
registerNativeGetter(startContainer, "startContainer");

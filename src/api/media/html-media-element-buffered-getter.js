import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireMediaElement } from "./html-media-element-state.js";
import { createTimeRanges } from "./time-ranges-state.js";

export const buffered = Object.getOwnPropertyDescriptor({
  get buffered() {
    requireMediaElement(this);
    const result = createTimeRanges();
    traceGetter("window.HTMLMediaElement.prototype.buffered", "HTMLMediaElement", result);
    return result;
  },
}, "buffered").get;
registerNativeGetter(buffered, "buffered");

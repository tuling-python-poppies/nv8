import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireMediaElement } from "./html-media-element-state.js";
import { createTimeRanges } from "./time-ranges-state.js";

export const seekable = Object.getOwnPropertyDescriptor({
  get seekable() {
    const state = requireMediaElement(this);
    const result = createTimeRanges(
      Number.isFinite(state.duration) && state.duration > 0
        ? [[0, state.duration]]
        : [],
    );
    traceGetter("window.HTMLMediaElement.prototype.seekable", "HTMLMediaElement", result);
    return result;
  },
}, "seekable").get;
registerNativeGetter(seekable, "seekable");

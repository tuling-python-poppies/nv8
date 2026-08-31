import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireMediaElement } from "./html-media-element-state.js";
import { createTimeRanges } from "./time-ranges-state.js";

export const played = Object.getOwnPropertyDescriptor({
  get played() {
    const state = requireMediaElement(this);
    const result = createTimeRanges(
      state.hasPlayed && state.currentTime > 0 ? [[0, state.currentTime]] : [],
    );
    traceGetter("window.HTMLMediaElement.prototype.played", "HTMLMediaElement", result);
    return result;
  },
}, "played").get;
registerNativeGetter(played, "played");

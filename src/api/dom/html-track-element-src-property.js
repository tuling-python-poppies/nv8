import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import {
  requireTrackElement,
  TRACK_LOADING,
  TRACK_NONE,
} from "./html-track-element-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get src() {
    requireTrackElement(this);
    const result = this.getAttribute("src") ?? "";
    traceGetter("window.HTMLTrackElement.prototype.src", "HTMLTrackElement", result);
    return result;
  },
  set src(value) {
    const state = requireTrackElement(this);
    const normalized = `${value}`;
    this.setAttribute("src", normalized);
    state.readyState = normalized === "" ? TRACK_NONE : TRACK_LOADING;
  },
}, "src");
export const src = descriptor.get;
export const setSrc = descriptor.set;
registerNativeGetter(src, "src");
registerNativeFunction(setSrc, "set src");

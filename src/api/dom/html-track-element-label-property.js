import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { requireTrackElement } from "./html-track-element-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get label() {
    requireTrackElement(this);
    const result = this.getAttribute("label") ?? "";
    traceGetter("window.HTMLTrackElement.prototype.label", "HTMLTrackElement", result);
    return result;
  },
  set label(value) {
    requireTrackElement(this);
    this.setAttribute("label", `${value}`);
  },
}, "label");
export const label = descriptor.get;
export const setLabel = descriptor.set;
registerNativeGetter(label, "label");
registerNativeFunction(setLabel, "set label");

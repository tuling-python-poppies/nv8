import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { requireTrackElement } from "./html-track-element-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get srclang() {
    requireTrackElement(this);
    const result = this.getAttribute("srclang") ?? "";
    traceGetter("window.HTMLTrackElement.prototype.srclang", "HTMLTrackElement", result);
    return result;
  },
  set srclang(value) {
    requireTrackElement(this);
    this.setAttribute("srclang", `${value}`);
  },
}, "srclang");
export const srclang = descriptor.get;
export const setSrclang = descriptor.set;
registerNativeGetter(srclang, "srclang");
registerNativeFunction(setSrclang, "set srclang");

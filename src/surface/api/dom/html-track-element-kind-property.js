import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireTrackElement } from "./html-track-element-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get kind() {
    requireTrackElement(this);
    const result = this.getAttribute("kind") ?? "subtitles";
    traceGetter("window.HTMLTrackElement.prototype.kind", "HTMLTrackElement", result);
    return result;
  },
  set kind(value) {
    requireTrackElement(this);
    this.setAttribute("kind", `${value}`);
  },
}, "kind");
export const kind = descriptor.get;
export const setKind = descriptor.set;
registerNativeGetter(kind, "kind");
registerNativeFunction(setKind, "set kind");

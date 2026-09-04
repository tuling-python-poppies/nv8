import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { linkElementSheet } from "./html-link-element-sheet-state.js";
export const sheet = Object.getOwnPropertyDescriptor({
  get sheet() {
    const result = linkElementSheet(this);
    traceGetter("window.HTMLLinkElement.prototype.sheet", "HTMLLinkElement", result);
    return result;
  },
}, "sheet").get;
registerNativeGetter(sheet, "sheet");

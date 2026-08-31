import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { styleElementSheet } from "./html-style-element-sheet-state.js";

export const sheet = Object.getOwnPropertyDescriptor({
  get sheet() {
    const result = styleElementSheet(this);
    traceGetter(
      "window.HTMLStyleElement.prototype.sheet",
      "HTMLStyleElement",
      result,
    );
    return result;
  },
}, "sheet").get;
registerNativeGetter(sheet, "sheet");

import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { refreshStyleSheetList } from "./style-sheet-list-state.js";
export const length = Object.getOwnPropertyDescriptor({
  get length() {
    const result = refreshStyleSheetList(this).length;
    traceGetter("window.StyleSheetList.prototype.length", "StyleSheetList", result);
    return result;
  },
}, "length").get;
registerNativeGetter(length, "length");

import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { refreshStyleSheetList } from "./style-sheet-list-state.js";
export function item(index) {
  const result = refreshStyleSheetList(this)[Number(index) >>> 0] ?? null;
  traceCall("window.StyleSheetList.prototype.item", "StyleSheetList", [index], result);
  return result;
}
registerNativeFunction(item, "item");

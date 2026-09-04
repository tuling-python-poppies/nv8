import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { refreshStyleSheetList } from "./style-sheet-list-state.js";
export function values() {
  const result = refreshStyleSheetList(this).values();
  traceCall("window.StyleSheetList.prototype.Symbol(Symbol.iterator)", "StyleSheetList", [], result);
  return result;
}
registerNativeFunction(values, "values");

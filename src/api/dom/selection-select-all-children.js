import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { selectAllChildren } from "./selection-state.js";
export const selectAllChildrenCallback = { selectAllChildren(node) {
  selectAllChildren(this, node);
  traceCall("window.Selection.prototype.selectAllChildren", "Selection", [node], undefined);
}}.selectAllChildren;
registerNativeFunction(selectAllChildrenCallback, "selectAllChildren");

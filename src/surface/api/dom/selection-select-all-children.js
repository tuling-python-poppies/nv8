import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { selectAllChildren } from "./selection-state.js";
export const selectAllChildrenCallback = { selectAllChildren(node) {
  selectAllChildren(this, node);
  traceCall("window.Selection.prototype.selectAllChildren", "Selection", [node], undefined);
}}.selectAllChildren;
registerNativeFunction(selectAllChildrenCallback, "selectAllChildren");

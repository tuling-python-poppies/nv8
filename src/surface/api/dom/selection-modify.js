import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  collapseSelection,
  extendSelection,
  requireSelection,
} from "./selection-state.js";
import { requireNode } from "./node-state.js";

export const modify = { modify() {
  const alter = `${arguments[0] ?? "move"}`.toLowerCase();
  const direction = `${arguments[1] ?? "forward"}`.toLowerCase();
  const granularity = `${arguments[2] ?? "character"}`.toLowerCase();
  const state = requireSelection(this);
  if (state.focusNode !== null && granularity === "character") {
    const record = requireNode(state.focusNode);
    const length = record.nodeType === 3
      ? (record.nodeValue ?? "").length
      : record.children.length;
    const delta = direction === "backward" || direction === "left" ? -1 : 1;
    const offset = Math.max(0, Math.min(length, state.focusOffset + delta));
    if (alter === "extend") extendSelection(this, state.focusNode, offset);
    else collapseSelection(this, state.focusNode, offset);
  }
  traceCall("window.Selection.prototype.modify", "Selection", [alter, direction, granularity], undefined);
}}.modify;
registerNativeFunction(modify, "modify");

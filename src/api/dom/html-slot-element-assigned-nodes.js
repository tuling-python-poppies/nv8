import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { assignedNodesForSlot } from "./shadow-root-state.js";

export const assignedNodes = {
  assignedNodes() {
    const result = assignedNodesForSlot(
      this,
      Boolean(arguments[0]?.flatten),
    );
    traceCall(
      "window.HTMLSlotElement.prototype.assignedNodes",
      "HTMLSlotElement",
      [arguments[0]],
      result,
    );
    return result;
  },
}.assignedNodes;
registerNativeFunction(assignedNodes, "assignedNodes");

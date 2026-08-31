import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { assignedNodesForSlot } from "./shadow-root-state.js";
import { ELEMENT_NODE, requireNode } from "./node-state.js";

export const assignedElements = {
  assignedElements() {
    const flatten = Boolean(arguments[0]?.flatten);
    const result = assignedNodesForSlot(this, flatten).filter(
      node => requireNode(node).nodeType === ELEMENT_NODE,
    );
    traceCall(
      "window.HTMLSlotElement.prototype.assignedElements",
      "HTMLSlotElement",
      [arguments[0]],
      result,
    );
    return result;
  },
}.assignedElements;
registerNativeFunction(assignedElements, "assignedElements");

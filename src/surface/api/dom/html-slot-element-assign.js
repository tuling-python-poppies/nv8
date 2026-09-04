import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { setManualSlotAssignments } from "./shadow-root-state.js";

export const assign = {
  assign(...nodes) {
    setManualSlotAssignments(this, nodes);
    traceCall(
      "window.HTMLSlotElement.prototype.assign",
      "HTMLSlotElement",
      nodes,
      undefined,
    );
  },
}.assign;
Object.defineProperty(assign, "length", { value: 0 });
registerNativeFunction(assign, "assign");

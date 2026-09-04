import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireElement } from "./element-state.js";
import { directTableChild } from "./html-table-element-state.js";

export const deleteTFoot = {
  deleteTFoot() {
    requireElement(this);
    directTableChild(this, "tfoot")?.remove();
    traceCall("window.HTMLTableElement.prototype.deleteTFoot", "HTMLTableElement", [], undefined);
  },
}.deleteTFoot;
registerNativeFunction(deleteTFoot, "deleteTFoot");

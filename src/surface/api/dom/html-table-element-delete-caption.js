import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireElement } from "./element-state.js";
import { directTableChild } from "./html-table-element-state.js";

export const deleteCaption = {
  deleteCaption() {
    requireElement(this);
    directTableChild(this, "caption")?.remove();
    traceCall("window.HTMLTableElement.prototype.deleteCaption", "HTMLTableElement", [], undefined);
  },
}.deleteCaption;
registerNativeFunction(deleteCaption, "deleteCaption");

import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireElement } from "./element-state.js";
import { directTableChild } from "./html-table-element-state.js";

export const deleteTHead = {
  deleteTHead() {
    requireElement(this);
    directTableChild(this, "thead")?.remove();
    traceCall("window.HTMLTableElement.prototype.deleteTHead", "HTMLTableElement", [], undefined);
  },
}.deleteTHead;
registerNativeFunction(deleteTHead, "deleteTHead");

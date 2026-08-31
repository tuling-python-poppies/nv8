import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireElement } from "./element-state.js";
import { directTableChild, setDirectTableChild } from "./html-table-element-state.js";

export const createTHead = {
  createTHead() {
    requireElement(this);
    let result = directTableChild(this, "thead");
    if (result === null) {
      result = this.ownerDocument.createElement("thead");
      setDirectTableChild(this, "thead", result);
    }
    traceCall("window.HTMLTableElement.prototype.createTHead", "HTMLTableElement", [], result);
    return result;
  },
}.createTHead;
registerNativeFunction(createTHead, "createTHead");

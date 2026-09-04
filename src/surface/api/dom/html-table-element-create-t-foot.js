import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireElement } from "./element-state.js";
import { directTableChild, setDirectTableChild } from "./html-table-element-state.js";

export const createTFoot = {
  createTFoot() {
    requireElement(this);
    let result = directTableChild(this, "tfoot");
    if (result === null) {
      result = this.ownerDocument.createElement("tfoot");
      setDirectTableChild(this, "tfoot", result);
    }
    traceCall("window.HTMLTableElement.prototype.createTFoot", "HTMLTableElement", [], result);
    return result;
  },
}.createTFoot;
registerNativeFunction(createTFoot, "createTFoot");

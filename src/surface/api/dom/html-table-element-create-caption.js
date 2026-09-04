import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireElement } from "./element-state.js";
import { directTableChild, setDirectTableChild } from "./html-table-element-state.js";

export const createCaption = {
  createCaption() {
    requireElement(this);
    let result = directTableChild(this, "caption");
    if (result === null) {
      result = this.ownerDocument.createElement("caption");
      setDirectTableChild(this, "caption", result);
    }
    traceCall("window.HTMLTableElement.prototype.createCaption", "HTMLTableElement", [], result);
    return result;
  },
}.createCaption;
registerNativeFunction(createCaption, "createCaption");

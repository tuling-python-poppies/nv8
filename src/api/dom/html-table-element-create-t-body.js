import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireElement } from "./element-state.js";
import { directTableChild, tableBodies } from "./html-table-element-state.js";

export const createTBody = {
  createTBody() {
    requireElement(this);
    const result = this.ownerDocument.createElement("tbody");
    const bodies = tableBodies(this);
    const foot = directTableChild(this, "tfoot");
    const reference = bodies.length === 0 ? foot : bodies.at(-1).nextSibling;
    this.insertBefore(result, reference);
    traceCall("window.HTMLTableElement.prototype.createTBody", "HTMLTableElement", [], result);
    return result;
  },
}.createTBody;
registerNativeFunction(createTBody, "createTBody");

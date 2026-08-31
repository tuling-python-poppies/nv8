import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { selectionDelete } from "./selection-state.js";
export const deleteFromDocument = { deleteFromDocument() {
  selectionDelete(this);
  traceCall("window.Selection.prototype.deleteFromDocument", "Selection", [], undefined);
}}.deleteFromDocument;
registerNativeFunction(deleteFromDocument, "deleteFromDocument");

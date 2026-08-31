import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { Document } from "./document-constructor.js";
import { requireDocument } from "./document-record.js";
import { selectionForDocument } from "./selection-state.js";
export const getSelection = { getSelection() {
  requireDocument(this);
  const result = selectionForDocument(this);
  traceCall("window.Document.prototype.getSelection", "Document", [], result);
  return result;
}}.getSelection;
registerNativeFunction(getSelection, "getSelection");
export function installDocumentGetSelection() {
  definePrototypeMethod(Document.prototype, "getSelection", getSelection);
}

import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { currentDocument } from "./document-state.js";
import { selectionForDocument } from "./selection-state.js";
export const getSelection = { getSelection() {
  const result = selectionForDocument(currentDocument());
  traceCall("window.getSelection", "Window", [], result);
  return result;
}}.getSelection;
registerNativeFunction(getSelection, "getSelection");

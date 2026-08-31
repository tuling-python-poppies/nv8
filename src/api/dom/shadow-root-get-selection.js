import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireNode } from "./node-state.js";
import { selectionForDocument } from "./selection-state.js";
import { requireShadowRoot } from "./shadow-root-state.js";

export const getSelection = {
  getSelection() {
    requireShadowRoot(this);
    const result = selectionForDocument(requireNode(this).ownerDocument);
    traceCall(
      "window.ShadowRoot.prototype.getSelection",
      "ShadowRoot",
      [],
      result,
    );
    return result;
  },
}.getSelection;
registerNativeFunction(getSelection, "getSelection");

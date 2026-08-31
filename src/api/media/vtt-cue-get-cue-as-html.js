import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { createDocumentFragment } from "../dom/document-fragment-constructor.js";
import { currentDocument } from "../dom/document-state.js";
import { appendChildAlgorithm } from "../dom/node-algorithms.js";
import { createText } from "../dom/text-constructor.js";
import { requireVTTCue } from "./vtt-cue-state.js";
export const getCueAsHTML = {
  getCueAsHTML() {
    const state = requireVTTCue(this);
    const document = currentDocument();
    const fragment = createDocumentFragment(document);
    appendChildAlgorithm(fragment, createText(state.text, document));
    traceCall(
      "window.VTTCue.prototype.getCueAsHTML",
      "VTTCue",
      [],
      fragment,
    );
    return fragment;
  },
}.getCueAsHTML;
registerNativeFunction(getCueAsHTML, "getCueAsHTML");

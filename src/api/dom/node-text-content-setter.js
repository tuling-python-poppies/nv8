import { registerNativeFunction } from "../../webidl/native-function.js";
import {
  ATTRIBUTE_NODE,
  CDATA_SECTION_NODE,
  COMMENT_NODE,
  DOCUMENT_TYPE_NODE,
  PROCESSING_INSTRUCTION_NODE,
  removeNode,
  requireNode,
  setNodeValue,
  TEXT_NODE,
} from "./node-state.js";

export const setTextContent = Object.getOwnPropertyDescriptor({
  set textContent(value) {
    const state = requireNode(this);
    if (state.nodeType === DOCUMENT_TYPE_NODE) {
      return;
    }
    const text = value === null ? "" : `${value}`;
    if (
      state.nodeType === ATTRIBUTE_NODE
      || state.nodeType === CDATA_SECTION_NODE
      || state.nodeType === COMMENT_NODE
      || state.nodeType === PROCESSING_INSTRUCTION_NODE
      || state.nodeType === TEXT_NODE
    ) {
      setNodeValue(this, text);
      return;
    }
    for (const child of state.children.slice()) {
      removeNode(this, child);
    }
    if (text !== "") {
      const document = state.nodeType === 9 ? this : state.ownerDocument;
      if (document !== null && typeof document.createTextNode === "function") {
        this.appendChild(document.createTextNode(text));
      }
    }
  },
}, "textContent").set;
registerNativeFunction(setTextContent, "set textContent");

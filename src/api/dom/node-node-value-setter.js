import { registerNativeFunction } from "../../webidl/native-function.js";
import {
  ATTRIBUTE_NODE,
  CDATA_SECTION_NODE,
  COMMENT_NODE,
  PROCESSING_INSTRUCTION_NODE,
  requireNode,
  setNodeValue,
  TEXT_NODE,
} from "./node-state.js";

export const setNodeValueCallback = Object.getOwnPropertyDescriptor({
  set nodeValue(value) {
    const state = requireNode(this);
    if (
      state.nodeType === ATTRIBUTE_NODE
      || state.nodeType === CDATA_SECTION_NODE
      || state.nodeType === COMMENT_NODE
      || state.nodeType === PROCESSING_INSTRUCTION_NODE
      || state.nodeType === TEXT_NODE
    ) {
      setNodeValue(this, value === null ? "" : `${value}`);
    }
  },
}, "nodeValue").set;
registerNativeFunction(setNodeValueCallback, "set nodeValue");

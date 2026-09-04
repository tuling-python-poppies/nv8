import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireElement } from "./element-state.js";
import { parseFragment } from "./html-parser.js";
import {
  insertNode,
  removeNode,
  requireNode,
} from "./node-state.js";

export const setOuterHTML = Object.getOwnPropertyDescriptor({
  set outerHTML(value) {
    requireElement(this);
    const state = requireNode(this);
    if (state.parent === null) {
      return;
    }
    if (requireNode(state.parent).nodeType === 9) {
      throw new DOMException(
        "The element has a Document parent.",
        "NoModificationAllowedError",
      );
    }
    const fragment = parseFragment(state.ownerDocument, `${value}`, state.parent);
    insertNode(state.parent, fragment, this);
    removeNode(state.parent, this);
  },
}, "outerHTML").set;
registerNativeFunction(setOuterHTML, "set outerHTML");

import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireElement } from "./element-state.js";
import { parseFragment } from "./html-parser.js";
import { replaceChildrenAlgorithm } from "./parent-node-algorithms.js";
import { requireNode } from "./node-state.js";
import {
  isTemplate,
  requireTemplate,
} from "./html-template-element-state.js";

export const setInnerHTML = Object.getOwnPropertyDescriptor({
  set innerHTML(value) {
    requireElement(this);
    const document = requireNode(this).ownerDocument;
    const fragment = parseFragment(document, `${value}`, this);
    const target = isTemplate(this) ? requireTemplate(this).content : this;
    replaceChildrenAlgorithm(target, [fragment]);
  },
}, "innerHTML").set;
registerNativeFunction(setInnerHTML, "set innerHTML");

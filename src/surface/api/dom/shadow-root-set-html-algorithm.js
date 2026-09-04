import { parseFragment } from "./html-parser.js";
import { replaceChildrenAlgorithm } from "./parent-node-algorithms.js";
import { requireNode } from "./node-state.js";
import { requireShadowRoot } from "./shadow-root-state.js";

export function setShadowHTML(root, value) {
  requireShadowRoot(root);
  const fragment = parseFragment(requireNode(root).ownerDocument, `${value}`);
  replaceChildrenAlgorithm(root, [fragment]);
}

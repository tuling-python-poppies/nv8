import {
  insertNode,
  isNode,
  removeNode,
  requireNode,
} from "./node-state.js";

export function appendAlgorithm(parent, values) {
  for (const node of convertNodes(parent, values)) {
    insertNode(parent, node);
  }
}

export function prependAlgorithm(parent, values) {
  const reference = requireNode(parent).children[0] ?? null;
  for (const node of convertNodes(parent, values)) {
    insertNode(parent, node, reference);
  }
}

export function replaceChildrenAlgorithm(parent, values) {
  const state = requireNode(parent);
  for (const child of state.children.slice()) {
    removeNode(parent, child);
  }
  appendAlgorithm(parent, values);
}

function convertNodes(parent, values) {
  const state = requireNode(parent);
  const document = state.nodeType === 9 ? parent : state.ownerDocument;
  const nodes = [];
  for (const value of values) {
    if (isNode(value)) {
      nodes.push(value);
    } else if (document !== null && typeof document.createTextNode === "function") {
      nodes.push(document.createTextNode(`${value}`));
    } else {
      throw new DOMException("No owner document is available.", "InvalidStateError");
    }
  }
  return nodes;
}

import { createNodeList, refreshNodeList } from "./node-list-state.js";
import {
  DOCUMENT_NODE,
  ELEMENT_NODE,
  requireNode,
  rootOf,
  textContentOf,
} from "./node-state.js";

export function nodeTypeValue(node) {
  return requireNode(node).nodeType;
}

export function nodeNameValue(node) {
  return requireNode(node).nodeName;
}

export function baseURIValue(node) {
  const state = requireNode(node);
  const document = state.nodeType === DOCUMENT_NODE ? node : state.ownerDocument;
  return document === null ? "about:blank" : (document.URL ?? "about:blank");
}

export function isConnectedValue(node) {
  let root = rootOf(node);
  while (requireNode(root).host !== undefined) {
    root = rootOf(requireNode(root).host);
  }
  return requireNode(root).nodeType === DOCUMENT_NODE;
}

export function ownerDocumentValue(node) {
  return requireNode(node).ownerDocument;
}

export function parentNodeValue(node) {
  return requireNode(node).parent;
}

export function parentElementValue(node) {
  const parent = requireNode(node).parent;
  return parent !== null && requireNode(parent).nodeType === ELEMENT_NODE
    ? parent
    : null;
}

export function childNodesValue(node) {
  const state = requireNode(node);
  if (state.childNodes === null) {
    state.childNodes = createNodeList(() => state.children, true);
  }
  refreshNodeList(state.childNodes);
  return state.childNodes;
}

export function firstChildValue(node) {
  return requireNode(node).children[0] ?? null;
}

export function lastChildValue(node) {
  const children = requireNode(node).children;
  return children[children.length - 1] ?? null;
}

export function previousSiblingValue(node) {
  const state = requireNode(node);
  if (state.parent === null) {
    return null;
  }
  const siblings = requireNode(state.parent).children;
  return siblings[siblings.indexOf(node) - 1] ?? null;
}

export function nextSiblingValue(node) {
  const state = requireNode(node);
  if (state.parent === null) {
    return null;
  }
  const siblings = requireNode(state.parent).children;
  return siblings[siblings.indexOf(node) + 1] ?? null;
}

export function nodeValueValue(node) {
  return requireNode(node).nodeValue;
}

export function textContentValue(node) {
  return textContentOf(node);
}

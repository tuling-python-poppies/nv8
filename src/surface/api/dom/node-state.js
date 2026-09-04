import { initializeEventTarget } from "../event/event-target-state.js";
import { refreshNodeList } from "./node-list-state.js";
import { createRealmSlot } from "../../../engine/core/state-scope.js";

// 迁移前这些是模块级状态，会跨宿主图 Realm 共享。
const nodeHookSlot = createRealmSlot(() => ({
  mutationHooks: new Set(),
}), "nodeHook");

function nodeHookState() {
  return nodeHookSlot.get(globalThis);
}

export const ELEMENT_NODE = 1;
export const ATTRIBUTE_NODE = 2;
export const TEXT_NODE = 3;
export const CDATA_SECTION_NODE = 4;
export const ENTITY_REFERENCE_NODE = 5;
export const ENTITY_NODE = 6;
export const PROCESSING_INSTRUCTION_NODE = 7;
export const COMMENT_NODE = 8;
export const DOCUMENT_NODE = 9;
export const DOCUMENT_TYPE_NODE = 10;
export const DOCUMENT_FRAGMENT_NODE = 11;
export const NOTATION_NODE = 12;

export const DOCUMENT_POSITION_DISCONNECTED = 1;
export const DOCUMENT_POSITION_PRECEDING = 2;
export const DOCUMENT_POSITION_FOLLOWING = 4;
export const DOCUMENT_POSITION_CONTAINS = 8;
export const DOCUMENT_POSITION_CONTAINED_BY = 16;
export const DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 32;

const nodeState = new WeakMap();

export function initializeNode(
  node,
  nodeType,
  nodeName,
  nodeValue = null,
  ownerDocument = null,
) {
  initializeEventTarget(node);
  const state = {
    nodeType,
    nodeName,
    nodeValue,
    parent: null,
    children: [],
    ownerDocument,
    childNodes: null,
    valueChangeCallback: null,
  };
  nodeState.set(node, state);
  return state;
}

export function requireNode(value) {
  const state = nodeState.get(value);
  if (state === undefined) {
    throw new TypeError("Illegal invocation");
  }
  return state;
}

export function isNode(value) {
  return nodeState.has(value);
}

export function registerMutationHook(callback) {
  nodeHookState().mutationHooks.add(callback);
  return () => nodeHookState().mutationHooks.delete(callback);
}

export function notifyMutation(record) {
  for (const callback of nodeHookState().mutationHooks) {
    callback(record);
  }
}

export function setOwnerDocumentDeep(node, ownerDocument) {
  const state = requireNode(node);
  if (state.nodeType !== DOCUMENT_NODE) {
    state.ownerDocument = ownerDocument;
  }
  for (const child of state.children) {
    setOwnerDocumentDeep(child, ownerDocument);
  }
}

export function rootOf(node) {
  let current = node;
  while (requireNode(current).parent !== null) {
    current = requireNode(current).parent;
  }
  return current;
}

export function isInclusiveAncestor(ancestor, node) {
  let current = node;
  while (current !== null) {
    if (current === ancestor) {
      return true;
    }
    current = requireNode(current).parent;
  }
  return false;
}

export function childIndex(node) {
  const state = requireNode(node);
  if (state.parent === null) {
    return -1;
  }
  return requireNode(state.parent).children.indexOf(node);
}

export function descendants(node) {
  const output = [];
  for (const child of requireNode(node).children) {
    output.push(child);
    output.push(...descendants(child));
  }
  return output;
}

export function textContentOf(node) {
  const state = requireNode(node);
  if (
    state.nodeType === TEXT_NODE
    || state.nodeType === COMMENT_NODE
    || state.nodeType === CDATA_SECTION_NODE
    || state.nodeType === PROCESSING_INSTRUCTION_NODE
    || state.nodeType === ATTRIBUTE_NODE
  ) {
    return state.nodeValue ?? "";
  }
  if (state.nodeType === DOCUMENT_TYPE_NODE) {
    return null;
  }
  let output = "";
  for (const child of state.children) {
    const childState = requireNode(child);
    if (
      childState.nodeType === TEXT_NODE
      || childState.nodeType === CDATA_SECTION_NODE
    ) {
      output += childState.nodeValue ?? "";
    } else if (
      childState.nodeType !== COMMENT_NODE
      && childState.nodeType !== PROCESSING_INSTRUCTION_NODE
    ) {
      output += textContentOf(child) ?? "";
    }
  }
  return output;
}

export function detachNode(node, suppressRecord = false) {
  const state = requireNode(node);
  if (state.parent === null) {
    return node;
  }
  const parent = state.parent;
  const parentState = requireNode(parent);
  const index = parentState.children.indexOf(node);
  if (index >= 0) {
    parentState.children.splice(index, 1);
  }
  refreshChildNodes(parentState);
  state.parent = null;
  if (!suppressRecord) {
    notifyMutation({
      type: "childList",
      target: parent,
      addedNodes: [],
      removedNodes: [node],
      previousSibling: parentState.children[index - 1] ?? null,
      nextSibling: parentState.children[index] ?? null,
      index,
    });
  }
  return node;
}

export function insertNode(parent, node, referenceNode = null) {
  const parentState = requireNode(parent);
  const nodeRecord = requireNode(node);
  if (
    parentState.nodeType !== DOCUMENT_NODE
    && parentState.nodeType !== DOCUMENT_FRAGMENT_NODE
    && parentState.nodeType !== ELEMENT_NODE
  ) {
    throw new DOMException(
      "This node type does not support this method.",
      "HierarchyRequestError",
    );
  }
  if (node === parent || isInclusiveAncestor(node, parent)) {
    throw new DOMException(
      "The new child element contains the parent.",
      "HierarchyRequestError",
    );
  }
  let index = parentState.children.length;
  if (referenceNode !== null) {
    index = parentState.children.indexOf(referenceNode);
    if (index < 0) {
      throw new DOMException(
        "The node before which the new node is to be inserted is not a child of this node.",
        "NotFoundError",
      );
    }
  }
  if (nodeRecord.nodeType === DOCUMENT_FRAGMENT_NODE) {
    const moving = nodeRecord.children.slice();
    for (const child of moving) {
      detachNode(child, true);
      insertNodeAt(parent, child, index);
      index += 1;
    }
    if (moving.length > 0) {
      refreshChildNodes(nodeRecord);
      notifyMutation({
        type: "childList",
        target: node,
        addedNodes: [],
        removedNodes: moving,
        previousSibling: null,
        nextSibling: null,
      });
      notifyMutation({
        type: "childList",
        target: parent,
        addedNodes: moving,
        removedNodes: [],
        previousSibling: parentState.children[index - moving.length - 1] ?? null,
        nextSibling: parentState.children[index] ?? null,
        index: index - moving.length,
      });
    }
    return node;
  }
  const oldParent = nodeRecord.parent;
  if (oldParent !== null) {
    const oldIndex = childIndex(node);
    detachNode(node);
    if (oldParent === parent && oldIndex < index) {
      index -= 1;
    }
  }
  insertNodeAt(parent, node, index);
  notifyMutation({
    type: "childList",
    target: parent,
    addedNodes: [node],
    removedNodes: [],
    previousSibling: parentState.children[index - 1] ?? null,
    nextSibling: parentState.children[index + 1] ?? null,
    index,
  });
  return node;
}

function insertNodeAt(parent, node, index) {
  const parentState = requireNode(parent);
  const state = requireNode(node);
  parentState.children.splice(index, 0, node);
  refreshChildNodes(parentState);
  state.parent = parent;
  const document = parentState.nodeType === DOCUMENT_NODE
    ? parent
    : parentState.ownerDocument;
  setOwnerDocumentDeep(node, document);
}

function refreshChildNodes(state) {
  if (state.childNodes !== null) {
    refreshNodeList(state.childNodes);
  }
}

export function removeNode(parent, child) {
  const childState = requireNode(child);
  if (childState.parent !== parent) {
    throw new DOMException(
      "The node to be removed is not a child of this node.",
      "NotFoundError",
    );
  }
  return detachNode(child);
}

export function replaceNode(parent, node, child) {
  const parentState = requireNode(parent);
  const index = parentState.children.indexOf(child);
  if (index < 0) {
    throw new DOMException(
      "The node to be replaced is not a child of this node.",
      "NotFoundError",
    );
  }
  if (node === child) {
    return child;
  }
  const reference = parentState.children[index + 1] ?? null;
  removeNode(parent, child);
  insertNode(parent, node, reference);
  return child;
}

export function setNodeValue(node, value) {
  const state = requireNode(node);
  const oldValue = state.nodeValue;
  state.nodeValue = value;
  if (state.valueChangeCallback !== null) {
    state.valueChangeCallback(value, oldValue);
  }
  notifyMutation({
    type: "characterData",
    target: node,
    oldValue,
  });
}

import {
  isInclusiveAncestor,
  isNode,
  registerMutationHook,
  requireNode,
} from "./node-state.js";
import { NodeIterator } from "./node-iterator-constructor.js";

const FILTER_ACCEPT = 1;
import { createRealmSlot } from "../../core/state-scope.js";

// 迁移前这些是模块级状态，会跨宿主图 Realm 共享。
const nodeIteratorSlot = createRealmSlot(() => ({
  liveIterators: new Set(),
}), "nodeIterator");

function nodeIteratorState() {
  return nodeIteratorSlot.get(globalThis);
}
const iteratorState = new WeakMap();

export function createNodeIterator(root, whatToShow, filter) {
  if (!isNode(root)) {
    throw new TypeError("The root is not a Node.");
  }
  const iterator = Object.create(NodeIterator.prototype);
  iteratorState.set(iterator, {
    root,
    whatToShow: Number(whatToShow) >>> 0,
    filter: filter ?? null,
    referenceNode: root,
    pointerBeforeReferenceNode: true,
    active: false,
  });
  nodeIteratorState().liveIterators.add(iterator);
  return iterator;
}

export function requireNodeIterator(value) {
  const state = iteratorState.get(value);
  if (state === undefined) {
    throw new TypeError("Illegal invocation");
  }
  return state;
}

export function detachNodeIterator(iterator) {
  requireNodeIterator(iterator);
}

export function nextIteratorNode(iterator) {
  const state = requireNodeIterator(iterator);
  let node = state.referenceNode;
  let before = state.pointerBeforeReferenceNode;
  while (node !== null) {
    if (!before) {
      node = nextInSubtree(state.root, node);
    }
    before = false;
    if (node !== null && accepts(state, node)) {
      state.referenceNode = node;
      state.pointerBeforeReferenceNode = false;
      return node;
    }
  }
  return null;
}

export function previousIteratorNode(iterator) {
  const state = requireNodeIterator(iterator);
  let node = state.referenceNode;
  let before = state.pointerBeforeReferenceNode;
  while (node !== null) {
    if (before) {
      node = previousInSubtree(state.root, node);
    }
    before = true;
    if (node !== null && accepts(state, node)) {
      state.referenceNode = node;
      state.pointerBeforeReferenceNode = true;
      return node;
    }
  }
  return null;
}

function nextInSubtree(root, node) {
  const children = requireNode(node).children;
  if (children.length > 0) {
    return children[0];
  }
  while (node !== root) {
    const parent = requireNode(node).parent;
    if (parent === null) {
      return null;
    }
    const siblings = requireNode(parent).children;
    const index = siblings.indexOf(node);
    if (index >= 0 && index + 1 < siblings.length) {
      return siblings[index + 1];
    }
    node = parent;
  }
  return null;
}

function previousInSubtree(root, node) {
  if (node === root) {
    return null;
  }
  const parent = requireNode(node).parent;
  if (parent === null) {
    return null;
  }
  const siblings = requireNode(parent).children;
  const index = siblings.indexOf(node);
  if (index <= 0) {
    return parent;
  }
  return deepestLast(siblings[index - 1]);
}

function deepestLast(node) {
  let current = node;
  for (;;) {
    const children = requireNode(current).children;
    if (children.length === 0) {
      return current;
    }
    current = children[children.length - 1];
  }
}

function accepts(state, node) {
  const bit = 1 << (requireNode(node).nodeType - 1);
  if ((state.whatToShow & bit) === 0) {
    return false;
  }
  if (state.filter === null) {
    return true;
  }
  if (state.active) {
    throw new DOMException(
      "The traversal filter is already active.",
      "InvalidStateError",
    );
  }
  state.active = true;
  let result;
  try {
    result = typeof state.filter === "function"
      ? state.filter(node)
      : state.filter.acceptNode(node);
  } finally {
    state.active = false;
  }
  return (Number(result) >>> 0) === FILTER_ACCEPT;
}

registerMutationHook((record) => {
  if (record.type !== "childList" || record.removedNodes.length === 0) {
    return;
  }
  for (const iterator of nodeIteratorState().liveIterators) {
    repairRemovedReference(iterator, record);
  }
});

function repairRemovedReference(iterator, record) {
  const state = iteratorState.get(iterator);
  if (state === undefined) {
    nodeIteratorState().liveIterators.delete(iterator);
    return;
  }
  for (const removed of record.removedNodes) {
    if (
      !isInclusiveAncestor(removed, state.referenceNode)
      || !isInclusiveAncestor(state.root, record.target)
    ) {
      continue;
    }
    if (
      state.pointerBeforeReferenceNode
      && record.nextSibling !== null
    ) {
      state.referenceNode = record.nextSibling;
      continue;
    }
    if (record.previousSibling !== null) {
      state.referenceNode = deepestLast(record.previousSibling);
    } else {
      state.referenceNode = record.target;
    }
    state.pointerBeforeReferenceNode = false;
  }
}

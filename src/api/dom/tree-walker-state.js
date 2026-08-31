import { isNode, requireNode } from "./node-state.js";
import { TreeWalker } from "./tree-walker-constructor.js";

export const FILTER_ACCEPT = 1;
export const FILTER_REJECT = 2;
export const FILTER_SKIP = 3;

const walkerState = new WeakMap();

export function createTreeWalker(root, whatToShow, filter) {
  if (!isNode(root)) {
    throw new TypeError("The root is not a Node.");
  }
  const walker = Object.create(TreeWalker.prototype);
  walkerState.set(walker, {
    root,
    whatToShow: Number(whatToShow) >>> 0,
    filter: filter ?? null,
    currentNode: root,
    active: false,
  });
  return walker;
}

export function requireTreeWalker(value) {
  const state = walkerState.get(value);
  if (state === undefined) {
    throw new TypeError("Illegal invocation");
  }
  return state;
}

export function setTreeWalkerCurrentNode(walker, node) {
  if (!isNode(node)) {
    throw new TypeError("The current node is not a Node.");
  }
  requireTreeWalker(walker).currentNode = node;
}

export function firstChildOf(walker) {
  const state = requireTreeWalker(walker);
  const result = firstVisibleDescendant(state, state.currentNode);
  if (result !== null) {
    state.currentNode = result;
  }
  return result;
}

export function lastChildOf(walker) {
  const state = requireTreeWalker(walker);
  const result = lastVisibleChild(state, state.currentNode);
  if (result !== null) {
    state.currentNode = result;
  }
  return result;
}

export function parentOf(walker) {
  const state = requireTreeWalker(walker);
  let node = state.currentNode;
  while (node !== state.root) {
    node = requireNode(node).parent;
    if (node === null) {
      return null;
    }
    if (acceptNode(state, node) === FILTER_ACCEPT) {
      state.currentNode = node;
      return node;
    }
  }
  return null;
}

export function nextSiblingOf(walker) {
  const state = requireTreeWalker(walker);
  const result = siblingVisible(state, state.currentNode, 1);
  if (result !== null) {
    state.currentNode = result;
  }
  return result;
}

export function previousSiblingOf(walker) {
  const state = requireTreeWalker(walker);
  const result = siblingVisible(state, state.currentNode, -1);
  if (result !== null) {
    state.currentNode = result;
  }
  return result;
}

export function nextNodeOf(walker) {
  const state = requireTreeWalker(walker);
  let node = state.currentNode;
  if (acceptNode(state, node) !== FILTER_REJECT) {
    const descendant = firstVisibleDescendant(state, node);
    if (descendant !== null) {
      state.currentNode = descendant;
      return descendant;
    }
  }
  while (node !== state.root) {
    const sibling = siblingVisible(state, node, 1);
    if (sibling !== null) {
      state.currentNode = sibling;
      return sibling;
    }
    node = requireNode(node).parent;
    if (node === null) {
      break;
    }
  }
  return null;
}

export function previousNodeOf(walker) {
  const state = requireTreeWalker(walker);
  if (state.currentNode === state.root) {
    return null;
  }
  let node = state.currentNode;
  const sibling = siblingVisible(state, node, -1);
  if (sibling !== null) {
    node = deepestVisible(state, sibling);
    state.currentNode = node;
    return node;
  }
  while (node !== state.root) {
    node = requireNode(node).parent;
    if (node === null) {
      return null;
    }
    if (acceptNode(state, node) === FILTER_ACCEPT) {
      state.currentNode = node;
      return node;
    }
  }
  return null;
}

function firstVisibleDescendant(state, parent) {
  for (const child of requireNode(parent).children) {
    const accepted = acceptNode(state, child);
    if (accepted === FILTER_ACCEPT) {
      return child;
    }
    if (accepted !== FILTER_REJECT) {
      const nested = firstVisibleDescendant(state, child);
      if (nested !== null) {
        return nested;
      }
    }
  }
  return null;
}

function lastVisibleDescendant(state, parent) {
  const children = requireNode(parent).children;
  for (let index = children.length - 1; index >= 0; index -= 1) {
    const child = children[index];
    const accepted = acceptNode(state, child);
    if (accepted !== FILTER_REJECT) {
      const nested = lastVisibleDescendant(state, child);
      if (nested !== null) {
        return nested;
      }
    }
    if (accepted === FILTER_ACCEPT) {
      return child;
    }
  }
  return null;
}

function lastVisibleChild(state, parent) {
  const children = requireNode(parent).children;
  for (let index = children.length - 1; index >= 0; index -= 1) {
    const child = children[index];
    const accepted = acceptNode(state, child);
    if (accepted === FILTER_ACCEPT) {
      return child;
    }
    if (accepted !== FILTER_REJECT) {
      const nested = lastVisibleChild(state, child);
      if (nested !== null) {
        return nested;
      }
    }
  }
  return null;
}

function siblingVisible(state, node, direction) {
  let current = node;
  while (current !== state.root) {
    const parent = requireNode(current).parent;
    if (parent === null) {
      return null;
    }
    const siblings = requireNode(parent).children;
    let index = siblings.indexOf(current) + direction;
    while (index >= 0 && index < siblings.length) {
      const sibling = siblings[index];
      const accepted = acceptNode(state, sibling);
      if (accepted === FILTER_ACCEPT) {
        return sibling;
      }
      if (accepted !== FILTER_REJECT) {
        const nested = direction > 0
          ? firstVisibleDescendant(state, sibling)
          : lastVisibleDescendant(state, sibling);
        if (nested !== null) {
          return nested;
        }
      }
      index += direction;
    }
    if (parent === state.root || acceptNode(state, parent) !== FILTER_SKIP) {
      return null;
    }
    current = parent;
  }
  return null;
}

function deepestVisible(state, node) {
  const nested = lastVisibleDescendant(state, node);
  return nested ?? node;
}

function acceptNode(state, node) {
  const bit = 1 << (requireNode(node).nodeType - 1);
  if ((state.whatToShow & bit) === 0) {
    return FILTER_SKIP;
  }
  const filter = state.filter;
  if (filter === null) {
    return FILTER_ACCEPT;
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
    result = typeof filter === "function"
      ? filter(node)
      : filter.acceptNode(node);
  } finally {
    state.active = false;
  }
  const normalized = Number(result) >>> 0;
  return normalized === FILTER_REJECT || normalized === FILTER_SKIP
    ? normalized
    : FILTER_ACCEPT;
}

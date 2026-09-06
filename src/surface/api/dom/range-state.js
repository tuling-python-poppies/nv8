import { currentDocument } from "./document-state.js";
import {
  childIndex,
  descendants,
  isInclusiveAncestor,
  isNode,
  registerMutationHook,
  requireNode,
  rootOf,
} from "./node-state.js";
import { createRealmSlot } from "../../../engine/core/state-scope.js";

// 迁移前这些是模块级状态，会跨宿主图 Realm 共享。
const rangeSlot = createRealmSlot(() => ({
  ranges: new Set(),
}), "range");

function rangeRealmState() {
  return rangeSlot.get(globalThis);
}

const rangeState = new WeakMap();

registerMutationHook((record) => {
  for (const range of rangeRealmState().ranges) {
    updateRangeForMutation(range, record);
  }
});

export function initializeRange(range, document = currentDocument()) {
  if (document === null) {
    throw new DOMException("No document is available.", "InvalidStateError");
  }
  const state = {
    startContainer: document,
    startOffset: 0,
    endContainer: document,
    endOffset: 0,
  };
  rangeState.set(range, state);
  rangeRealmState().ranges.add(range);
  return state;
}

/**
 * `OpaqueRange`（Edge 152）的初始化。
 *
 * 与 `initializeRange` 的两点不同：
 *
 * - **不进 `ranges` 集合**。那个集合是给 DOM 变更钩子用的，让树里的 Range 随
 *   节点增删调整边界。`OpaqueRange` 指向的是表单控件 value 字符串的一段，
 *   与节点树无关，进去只会白跑钩子。
 * - **container 存 `null`**。这两个字段在 `OpaqueRange` 上取不到（getter 挂在
 *   `NodeRange.prototype`，而它不继承），但 `collapsed` 的实现要读——
 *   `null === null` 让它退化成「两个 offset 是否相等」，与实测一致。
 *
 * @param {object} range
 * @param {number} startOffset
 * @param {number} endOffset
 */
export function initializeOpaqueRange(range, startOffset, endOffset) {
  const state = {
    startContainer: null,
    startOffset,
    endContainer: null,
    endOffset,
  };
  rangeState.set(range, state);
  return state;
}

export function requireRange(value) {
  const state = rangeState.get(value);
  if (state === undefined) {
    throw new TypeError("Illegal invocation");
  }
  return state;
}

export function setRangeStart(range, node, offset) {
  const state = requireRange(range);
  const normalized = validateBoundary(node, offset);
  state.startContainer = node;
  state.startOffset = normalized;
  if (
    rootOf(state.startContainer) !== rootOf(state.endContainer)
    || compareBoundary(
      state.startContainer,
      state.startOffset,
      state.endContainer,
      state.endOffset,
    ) > 0
  ) {
    state.endContainer = node;
    state.endOffset = normalized;
  }
}

export function setRangeEnd(range, node, offset) {
  const state = requireRange(range);
  const normalized = validateBoundary(node, offset);
  state.endContainer = node;
  state.endOffset = normalized;
  if (
    rootOf(state.startContainer) !== rootOf(state.endContainer)
    || compareBoundary(
      state.startContainer,
      state.startOffset,
      state.endContainer,
      state.endOffset,
    ) > 0
  ) {
    state.startContainer = node;
    state.startOffset = normalized;
  }
}

export function validateBoundary(node, offset) {
  if (!isNode(node)) {
    throw new TypeError("The boundary container is not a Node.");
  }
  const normalized = Number(offset) >>> 0;
  const state = requireNode(node);
  if (state.nodeType === 10) {
    throw new DOMException("DocumentType cannot be a boundary container.", "InvalidNodeTypeError");
  }
  const length = boundaryLength(node);
  if (normalized > length) {
    throw new DOMException("The offset is larger than the node length.", "IndexSizeError");
  }
  return normalized;
}

export function boundaryLength(node) {
  const state = requireNode(node);
  return (
    state.nodeType === 3
    || state.nodeType === 4
    || state.nodeType === 7
    || state.nodeType === 8
  ) ? (state.nodeValue ?? "").length : state.children.length;
}

export function compareBoundary(aNode, aOffset, bNode, bOffset) {
  if (aNode === bNode) {
    return Math.sign(aOffset - bOffset);
  }
  if (rootOf(aNode) !== rootOf(bNode)) {
    throw new DOMException("The boundary points are in different trees.", "WrongDocumentError");
  }
  if (isInclusiveAncestor(aNode, bNode)) {
    let child = bNode;
    while (requireNode(child).parent !== aNode) {
      child = requireNode(child).parent;
    }
    return aOffset <= childIndex(child) ? -1 : 1;
  }
  if (isInclusiveAncestor(bNode, aNode)) {
    let child = aNode;
    while (requireNode(child).parent !== bNode) {
      child = requireNode(child).parent;
    }
    return childIndex(child) < bOffset ? -1 : 1;
  }
  const ordered = [rootOf(aNode), ...descendants(rootOf(aNode))];
  return ordered.indexOf(aNode) < ordered.indexOf(bNode) ? -1 : 1;
}

export function commonAncestor(range) {
  const state = requireRange(range);
  let node = state.startContainer;
  while (!isInclusiveAncestor(node, state.endContainer)) {
    node = requireNode(node).parent;
  }
  return node;
}

function updateRangeForMutation(range, record) {
  const state = requireRange(range);
  if (record.type === "childList") {
    const index = record.index ?? 0;
    const removed = record.removedNodes?.length ?? 0;
    const added = record.addedNodes?.length ?? 0;
    updateBoundary(state, "start", record.target, index, removed, added, record.removedNodes ?? []);
    updateBoundary(state, "end", record.target, index, removed, added, record.removedNodes ?? []);
  } else if (record.type === "characterData") {
    const newLength = (requireNode(record.target).nodeValue ?? "").length;
    if (state.startContainer === record.target && state.startOffset > newLength) {
      state.startOffset = newLength;
    }
    if (state.endContainer === record.target && state.endOffset > newLength) {
      state.endOffset = newLength;
    }
  }
}

function updateBoundary(state, prefix, target, index, removed, added, removedNodes) {
  const containerKey = `${prefix}Container`;
  const offsetKey = `${prefix}Offset`;
  const container = state[containerKey];
  for (const removedNode of removedNodes) {
    if (isInclusiveAncestor(removedNode, container)) {
      state[containerKey] = target;
      state[offsetKey] = index;
      return;
    }
  }
  if (container !== target) {
    return;
  }
  const offset = state[offsetKey];
  if (removed > 0 && offset > index) {
    state[offsetKey] = offset <= index + removed ? index : offset - removed;
  }
  if (added > 0 && state[offsetKey] > index) {
    state[offsetKey] += added;
  }
}

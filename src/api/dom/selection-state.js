import { createRange } from "./range-constructor.js";
import {
  compareBoundary,
  requireRange,
  setRangeEnd,
  setRangeStart,
  validateBoundary,
} from "./range-state.js";
import { isNode, requireNode, rootOf } from "./node-state.js";
import { Selection } from "./selection-constructor.js";

const selectionState = new WeakMap();
const documentSelections = new WeakMap();

export function selectionForDocument(document) {
  let selection = documentSelections.get(document);
  if (selection === undefined) {
    selection = Object.create(Selection.prototype);
    selectionState.set(selection, {
      document,
      range: null,
      anchorNode: null,
      anchorOffset: 0,
      focusNode: null,
      focusOffset: 0,
      direction: "none",
    });
    documentSelections.set(document, selection);
  }
  return selection;
}

export function requireSelection(value) {
  const state = selectionState.get(value);
  if (state === undefined) {
    throw new TypeError("Illegal invocation");
  }
  return state;
}

export function addSelectionRange(selection, range) {
  const state = requireSelection(selection);
  const rangeState = requireRange(range);
  if (state.range !== null) {
    return;
  }
  if (ownerDocumentOf(rangeState.startContainer) !== state.document) {
    return;
  }
  state.range = range;
  state.anchorNode = rangeState.startContainer;
  state.anchorOffset = rangeState.startOffset;
  state.focusNode = rangeState.endContainer;
  state.focusOffset = rangeState.endOffset;
  state.direction = isCollapsedState(state) ? "none" : "forward";
}

export function collapseSelection(selection, node, offset = 0) {
  const state = requireSelection(selection);
  if (node === null) {
    clearSelection(selection);
    return;
  }
  if (!isNode(node)) {
    throw new TypeError("The provided value is not a Node.");
  }
  if (ownerDocumentOf(node) !== state.document) {
    return;
  }
  const normalized = validateBoundary(node, offset);
  const range = createRange(state.document);
  setRangeStart(range, node, normalized);
  setRangeEnd(range, node, normalized);
  state.range = range;
  state.anchorNode = node;
  state.anchorOffset = normalized;
  state.focusNode = node;
  state.focusOffset = normalized;
  state.direction = "none";
}

export function setSelectionBaseAndExtent(
  selection,
  anchorNode,
  anchorOffset,
  focusNode,
  focusOffset,
) {
  const state = requireSelection(selection);
  const anchor = validateBoundary(anchorNode, anchorOffset);
  const focus = validateBoundary(focusNode, focusOffset);
  if (
    ownerDocumentOf(anchorNode) !== state.document
    || ownerDocumentOf(focusNode) !== state.document
  ) {
    return;
  }
  if (rootOf(anchorNode) !== rootOf(focusNode)) {
    throw new DOMException("The boundary points are in different trees.", "WrongDocumentError");
  }
  const range = createRange(state.document);
  const order = compareBoundary(anchorNode, anchor, focusNode, focus);
  if (order <= 0) {
    setRangeStart(range, anchorNode, anchor);
    setRangeEnd(range, focusNode, focus);
  } else {
    setRangeStart(range, focusNode, focus);
    setRangeEnd(range, anchorNode, anchor);
  }
  state.range = range;
  state.anchorNode = anchorNode;
  state.anchorOffset = anchor;
  state.focusNode = focusNode;
  state.focusOffset = focus;
  state.direction = order === 0 ? "none" : order < 0 ? "forward" : "backward";
}

export function extendSelection(selection, node, offset = 0) {
  const state = requireSelection(selection);
  if (state.range === null) {
    throw new DOMException("The selection has no range.", "InvalidStateError");
  }
  setSelectionBaseAndExtent(
    selection,
    state.anchorNode,
    state.anchorOffset,
    node,
    offset,
  );
}

export function clearSelection(selection) {
  const state = requireSelection(selection);
  state.range = null;
  state.anchorNode = null;
  state.anchorOffset = 0;
  state.focusNode = null;
  state.focusOffset = 0;
  state.direction = "none";
}

export function removeSelectionRange(selection, range) {
  const state = requireSelection(selection);
  requireRange(range);
  if (state.range !== range) {
    throw new DOMException("The range is not in the selection.", "NotFoundError");
  }
  clearSelection(selection);
}

export function selectionRangeAt(selection, index) {
  const state = requireSelection(selection);
  const normalized = Number(index) >>> 0;
  if (normalized !== 0 || state.range === null) {
    throw new DOMException("The index is not in the allowed range.", "IndexSizeError");
  }
  return state.range;
}

export function collapseSelectionToEdge(selection, toStart) {
  const state = requireSelection(selection);
  if (state.range === null) {
    throw new DOMException("The selection has no range.", "InvalidStateError");
  }
  const range = requireRange(state.range);
  collapseSelection(
    selection,
    toStart ? range.startContainer : range.endContainer,
    toStart ? range.startOffset : range.endOffset,
  );
}

export function selectAllChildren(selection, node) {
  if (!isNode(node) || requireNode(node).nodeType === 10) {
    throw new DOMException("The node cannot be selected.", "InvalidNodeTypeError");
  }
  setSelectionBaseAndExtent(
    selection,
    node,
    0,
    node,
    boundaryLength(node),
  );
}

export function selectionContainsNode(selection, node, allowPartial = false) {
  const state = requireSelection(selection);
  if (state.range === null || !isNode(node)) {
    return false;
  }
  const range = state.range;
  if (allowPartial) {
    return range.intersectsNode(node);
  }
  const nodeState = requireNode(node);
  if (nodeState.parent === null) {
    return false;
  }
  const index = nodeState.parent.childNodes
    ? Array.prototype.indexOf.call(nodeState.parent.childNodes, node)
    : requireNode(nodeState.parent).children.indexOf(node);
  return (
    range.comparePoint(nodeState.parent, index) === 0
    && range.comparePoint(nodeState.parent, index + 1) === 0
  );
}

export function selectionText(selection) {
  const state = requireSelection(selection);
  return state.range === null ? "" : state.range.toString();
}

export function selectionDelete(selection) {
  const state = requireSelection(selection);
  if (state.range !== null) {
    state.range.deleteContents();
    const range = requireRange(state.range);
    state.anchorNode = range.startContainer;
    state.anchorOffset = range.startOffset;
    state.focusNode = range.endContainer;
    state.focusOffset = range.endOffset;
    state.direction = "none";
  }
}

export function selectionValue(selection, key) {
  const state = requireSelection(selection);
  switch (key) {
    case "isCollapsed":
      return state.range === null || isCollapsedState(state);
    case "rangeCount":
      return state.range === null ? 0 : 1;
    case "type":
      return state.range === null ? "None" : isCollapsedState(state) ? "Caret" : "Range";
    case "baseNode":
      return state.anchorNode;
    case "baseOffset":
      return state.anchorOffset;
    case "extentNode":
      return state.focusNode;
    case "extentOffset":
      return state.focusOffset;
    default:
      return state[key];
  }
}

function isCollapsedState(state) {
  return state.anchorNode === state.focusNode
    && state.anchorOffset === state.focusOffset;
}

function boundaryLength(node) {
  const state = requireNode(node);
  return state.nodeType === 3 || state.nodeType === 4 || state.nodeType === 8
    ? (state.nodeValue ?? "").length
    : state.children.length;
}

function ownerDocumentOf(node) {
  const state = requireNode(node);
  return state.nodeType === 9 ? node : state.ownerDocument;
}

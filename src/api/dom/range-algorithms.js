import { parseFragment } from "./html-parser.js";
import {
  childIndex,
  descendants,
  insertNode,
  isInclusiveAncestor,
  isNode,
  removeNode,
  requireNode,
  setNodeValue,
  textContentOf,
} from "./node-state.js";
import {
  boundaryLength,
  compareBoundary,
  commonAncestor,
  initializeRange,
  requireRange,
  setRangeEnd,
  setRangeStart,
  validateBoundary,
} from "./range-state.js";

export function collapseRange(range, toStart = false) {
  const state = requireRange(range);
  if (toStart) {
    state.endContainer = state.startContainer;
    state.endOffset = state.startOffset;
  } else {
    state.startContainer = state.endContainer;
    state.startOffset = state.endOffset;
  }
}

export function cloneRangeAlgorithm(range) {
  const state = requireRange(range);
  const clone = Object.create(Object.getPrototypeOf(range));
  const cloneState = initializeRange(clone, ownerDocumentOf(state.startContainer));
  Object.assign(cloneState, state);
  return clone;
}

export function selectNodeAlgorithm(range, node) {
  if (!isNode(node)) {
    throw new TypeError("The provided value is not a Node.");
  }
  const parent = requireNode(node).parent;
  if (parent === null) {
    throw new DOMException("The node has no parent.", "InvalidNodeTypeError");
  }
  const index = childIndex(node);
  const state = requireRange(range);
  state.startContainer = parent;
  state.startOffset = index;
  state.endContainer = parent;
  state.endOffset = index + 1;
}

export function selectNodeContentsAlgorithm(range, node) {
  if (!isNode(node) || requireNode(node).nodeType === 10) {
    throw new DOMException("The node cannot be selected.", "InvalidNodeTypeError");
  }
  const state = requireRange(range);
  state.startContainer = node;
  state.startOffset = 0;
  state.endContainer = node;
  state.endOffset = boundaryLength(node);
}

export function setBoundaryBefore(range, node, start) {
  const parent = requireNode(node).parent;
  if (parent === null) {
    throw new DOMException("The node has no parent.", "InvalidNodeTypeError");
  }
  if (start) {
    setRangeStart(range, parent, childIndex(node));
  } else {
    setRangeEnd(range, parent, childIndex(node));
  }
}

export function setBoundaryAfter(range, node, start) {
  const parent = requireNode(node).parent;
  if (parent === null) {
    throw new DOMException("The node has no parent.", "InvalidNodeTypeError");
  }
  if (start) {
    setRangeStart(range, parent, childIndex(node) + 1);
  } else {
    setRangeEnd(range, parent, childIndex(node) + 1);
  }
}

export function rangeToString(range) {
  const state = requireRange(range);
  if (state.startContainer === state.endContainer) {
    const container = requireNode(state.startContainer);
    if (isCharacterData(container)) {
      return (container.nodeValue ?? "").slice(state.startOffset, state.endOffset);
    }
    return container.children.slice(state.startOffset, state.endOffset)
      .map(node => textContentOf(node) ?? "")
      .join("");
  }
  const textNodes = selectedTextNodes(range);
  let output = "";
  for (const node of textNodes) {
    const data = requireNode(node).nodeValue ?? "";
    let start = 0;
    let end = data.length;
    if (node === state.startContainer) {
      start = state.startOffset;
    }
    if (node === state.endContainer) {
      end = state.endOffset;
    }
    output += data.slice(start, end);
  }
  return output;
}

export function cloneContentsAlgorithm(range) {
  const state = requireRange(range);
  const document = ownerDocumentOf(state.startContainer);
  const fragment = document.createDocumentFragment();
  if (state.startContainer === state.endContainer) {
    const container = requireNode(state.startContainer);
    if (isCharacterData(container)) {
      const data = (container.nodeValue ?? "").slice(
        state.startOffset,
        state.endOffset,
      );
      if (data !== "") {
        fragment.appendChild(document.createTextNode(data));
      }
      return fragment;
    }
    for (const child of container.children.slice(state.startOffset, state.endOffset)) {
      fragment.appendChild(child.cloneNode(true));
    }
    return fragment;
  }
  const common = commonAncestor(range);
  for (const child of requireNode(common).children) {
    if (rangeIntersectsNode(range, child)) {
      fragment.appendChild(child.cloneNode(true));
    }
  }
  return fragment;
}

export function deleteContentsAlgorithm(range) {
  const state = requireRange(range);
  if (
    state.startContainer === state.endContainer
    && isCharacterData(requireNode(state.startContainer))
  ) {
    const node = state.startContainer;
    const data = requireNode(node).nodeValue ?? "";
    setNodeValue(
      node,
      `${data.slice(0, state.startOffset)}${data.slice(state.endOffset)}`,
    );
    state.endOffset = state.startOffset;
    return;
  }
  if (state.startContainer === state.endContainer) {
    const children = requireNode(state.startContainer).children.slice(
      state.startOffset,
      state.endOffset,
    );
    for (const child of children) {
      removeNode(state.startContainer, child);
    }
    state.endOffset = state.startOffset;
    return;
  }
  const common = commonAncestor(range);
  const removing = requireNode(common).children.filter(
    child => rangeIntersectsNode(range, child),
  );
  for (const child of removing) {
    removeNode(common, child);
  }
  state.startContainer = common;
  state.startOffset = 0;
  state.endContainer = common;
  state.endOffset = 0;
}

export function extractContentsAlgorithm(range) {
  const fragment = cloneContentsAlgorithm(range);
  deleteContentsAlgorithm(range);
  return fragment;
}

export function insertNodeAlgorithm(range, node) {
  if (!isNode(node)) {
    throw new TypeError("The provided value is not a Node.");
  }
  const state = requireRange(range);
  const start = requireNode(state.startContainer);
  if (isCharacterData(start)) {
    const tail = state.startContainer.splitText(state.startOffset);
    insertNode(start.parent, node, tail);
  } else {
    insertNode(
      state.startContainer,
      node,
      start.children[state.startOffset] ?? null,
    );
  }
}

export function createContextualFragmentAlgorithm(range, html) {
  const state = requireRange(range);
  const container = requireNode(state.startContainer).nodeType === 1
    ? state.startContainer
    : requireNode(state.startContainer).parent;
  return parseFragment(ownerDocumentOf(state.startContainer), `${html}`, container);
}

export function comparePointAlgorithm(range, node, offset) {
  const state = requireRange(range);
  const normalized = validateBoundary(node, offset);
  if (requireNode(node).ownerDocument !== ownerDocumentOf(state.startContainer)
    && requireNode(node).nodeType !== 9) {
    throw new DOMException("The point belongs to a different document.", "WrongDocumentError");
  }
  if (compareBoundary(node, normalized, state.startContainer, state.startOffset) < 0) {
    return -1;
  }
  if (compareBoundary(node, normalized, state.endContainer, state.endOffset) > 0) {
    return 1;
  }
  return 0;
}

export function isPointInRangeAlgorithm(range, node, offset) {
  try {
    return comparePointAlgorithm(range, node, offset) === 0;
  } catch (error) {
    if (error?.name === "WrongDocumentError") {
      return false;
    }
    throw error;
  }
}

export function rangeIntersectsNode(range, node) {
  if (!isNode(node)) {
    throw new TypeError("The provided value is not a Node.");
  }
  const parent = requireNode(node).parent;
  if (parent === null) {
    return node === commonAncestor(range);
  }
  const index = childIndex(node);
  const state = requireRange(range);
  return (
    compareBoundary(parent, index, state.endContainer, state.endOffset) < 0
    && compareBoundary(parent, index + 1, state.startContainer, state.startOffset) > 0
  );
}

export function compareBoundaryPointsAlgorithm(range, how, sourceRange) {
  const target = requireRange(range);
  const source = requireRange(sourceRange);
  switch (Number(how) >>> 0) {
    case 0:
      return compareBoundary(
        target.startContainer,
        target.startOffset,
        source.startContainer,
        source.startOffset,
      );
    case 1:
      return compareBoundary(
        target.endContainer,
        target.endOffset,
        source.startContainer,
        source.startOffset,
      );
    case 2:
      return compareBoundary(
        target.endContainer,
        target.endOffset,
        source.endContainer,
        source.endOffset,
      );
    case 3:
      return compareBoundary(
        target.startContainer,
        target.startOffset,
        source.endContainer,
        source.endOffset,
      );
    default:
      throw new DOMException("The comparison mode is invalid.", "NotSupportedError");
  }
}

export function surroundContentsAlgorithm(range, newParent) {
  if (!isNode(newParent) || requireNode(newParent).nodeType !== 1) {
    throw new TypeError("The new parent must be an Element.");
  }
  const fragment = extractContentsAlgorithm(range);
  while (requireNode(newParent).children.length > 0) {
    removeNode(newParent, requireNode(newParent).children[0]);
  }
  insertNodeAlgorithm(range, newParent);
  newParent.appendChild(fragment);
  selectNodeAlgorithm(range, newParent);
}

export function expandAlgorithm(range, unit = "word") {
  const state = requireRange(range);
  if (`${unit}` !== "word") {
    return;
  }
  if (
    state.startContainer !== state.endContainer
    || !isCharacterData(requireNode(state.startContainer))
  ) {
    return;
  }
  const data = requireNode(state.startContainer).nodeValue ?? "";
  let start = state.startOffset;
  let end = state.endOffset;
  while (start > 0 && /\w/u.test(data[start - 1])) {
    start -= 1;
  }
  while (end < data.length && /\w/u.test(data[end])) {
    end += 1;
  }
  state.startOffset = start;
  state.endOffset = end;
}

function selectedTextNodes(range) {
  const state = requireRange(range);
  const root = commonAncestor(range);
  return [root, ...descendants(root)].filter((node) => {
    const record = requireNode(node);
    return record.nodeType === 3 && (
      isInclusiveAncestor(node, state.startContainer)
      || isInclusiveAncestor(node, state.endContainer)
      || rangeIntersectsNode(range, node)
    );
  });
}

function isCharacterData(state) {
  return state.nodeType === 3
    || state.nodeType === 4
    || state.nodeType === 7
    || state.nodeType === 8;
}

function ownerDocumentOf(node) {
  const state = requireNode(node);
  return state.nodeType === 9 ? node : state.ownerDocument;
}

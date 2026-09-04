import { toDOMString } from "../../../engine/webidl/conversions.js";
import {
  childIndex,
  insertNode,
  isNode,
  removeNode,
  requireNode,
  setNodeValue,
} from "./node-state.js";

export function setData(node, value) {
  setNodeValue(node, toDOMString(value));
}

export function substringDataAlgorithm(node, offset, count) {
  const state = requireNode(node);
  const start = toUnsignedLong(offset);
  const length = toUnsignedLong(count);
  const data = state.nodeValue ?? "";
  if (start > data.length) {
    throw new DOMException("The offset is larger than the data length.", "IndexSizeError");
  }
  return data.slice(start, start + length);
}

export function appendDataAlgorithm(node, data) {
  const state = requireNode(node);
  setNodeValue(node, `${state.nodeValue ?? ""}${toDOMString(data)}`);
}

export function insertDataAlgorithm(node, offset, data) {
  replaceDataAlgorithm(node, offset, 0, data);
}

export function deleteDataAlgorithm(node, offset, count) {
  replaceDataAlgorithm(node, offset, count, "");
}

export function replaceDataAlgorithm(node, offset, count, data) {
  const state = requireNode(node);
  const start = toUnsignedLong(offset);
  const removeCount = toUnsignedLong(count);
  const current = state.nodeValue ?? "";
  if (start > current.length) {
    throw new DOMException("The offset is larger than the data length.", "IndexSizeError");
  }
  setNodeValue(
    node,
    `${current.slice(0, start)}${toDOMString(data)}${current.slice(start + removeCount)}`,
  );
}

export function removeAlgorithm(node) {
  const state = requireNode(node);
  if (state.parent !== null) {
    removeNode(state.parent, node);
  }
}

export function beforeAlgorithm(node, values) {
  const state = requireNode(node);
  if (state.parent === null) {
    return;
  }
  const nodes = convertNodes(state.ownerDocument, values);
  for (const value of nodes) {
    insertNode(state.parent, value, node);
  }
}

export function afterAlgorithm(node, values) {
  const state = requireNode(node);
  if (state.parent === null) {
    return;
  }
  let reference = requireNode(state.parent).children[childIndex(node) + 1] ?? null;
  for (const value of convertNodes(state.ownerDocument, values)) {
    insertNode(state.parent, value, reference);
  }
}

export function replaceWithAlgorithm(node, values) {
  const state = requireNode(node);
  if (state.parent === null) {
    return;
  }
  const parent = state.parent;
  const reference = requireNode(parent).children[childIndex(node) + 1] ?? null;
  removeNode(parent, node);
  for (const value of convertNodes(state.ownerDocument, values)) {
    insertNode(parent, value, reference);
  }
}

function convertNodes(document, values) {
  const output = [];
  for (const value of values) {
    if (isNode(value)) {
      output.push(value);
    } else if (document !== null && typeof document.createTextNode === "function") {
      output.push(document.createTextNode(toDOMString(value)));
    } else {
      throw new DOMException("No owner document is available.", "InvalidStateError");
    }
  }
  return output;
}

function toUnsignedLong(value) {
  return Number(value) >>> 0;
}

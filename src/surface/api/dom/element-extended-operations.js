import { createHTMLCollection } from "./html-collection-state.js";
import { parseFragment } from "./html-parser.js";
import { serializeChildren } from "./html-serializer.js";
import {
  descendantElements,
  requireElement,
} from "./element-state.js";
import { setInnerHTML } from "./element-inner-html-setter.js";
import {
  insertNode,
  isNode,
  requireNode,
} from "./node-state.js";

const namespaceCollections = new WeakMap();

export function previousElementSiblingOperation(element) {
  return elementSibling(element, -1);
}
export function nextElementSiblingOperation(element) {
  return elementSibling(element, 1);
}
export function checkVisibilityOperation() {
  return true;
}
export function getAnimationsOperation(element) {
    return animationsForElement(element);
  }
export function getElementsByTagNameNSOperation(element, args) {
  const namespace = args[0] === null ? null : `${args[0]}`;
  const localName = `${args[1]}`;
  let cache = namespaceCollections.get(element);
  if (cache === undefined) {
    cache = new Map();
    namespaceCollections.set(element, cache);
  }
  const key = `${namespace}\0${localName}`;
  let collection = cache.get(key);
  if (collection === undefined) {
    collection = createHTMLCollection(
      () => descendantElements(element).filter(candidate => (
        (namespace === "*" || candidate.namespaceURI === namespace)
        && (localName === "*" || candidate.localName === localName)
      )),
    );
    cache.set(key, collection);
  }
  return collection;
}
export function getHTMLOperation(element) {
  return serializeChildren(element);
}
export function hasPointerCaptureOperation(element, args) {
  return requireElement(element).capturedPointers.has(Number(args[0]) | 0);
}
export function setPointerCaptureOperation(element, args) {
  requireElement(element).capturedPointers.add(Number(args[0]) | 0);
}
export function releasePointerCaptureOperation(element, args) {
  requireElement(element).capturedPointers.delete(Number(args[0]) | 0);
}
export function insertAdjacentElementOperation(element, args) {
  requireElement(args[1]);
  return insertAdjacent(element, args[0], args[1]);
}
export function insertAdjacentHTMLOperation(element, args) {
  const state = requireNode(element);
  const document = state.ownerDocument;
  const fragment = parseFragment(document, `${args[1]}`, element);
  insertAdjacent(element, args[0], fragment);
}
export function insertAdjacentTextOperation(element, args) {
  const document = requireNode(element).ownerDocument;
  insertAdjacent(element, args[0], document.createTextNode(`${args[1]}`));
}
export function moveBeforeOperation(element, args) {
  const node = args[0];
  const child = args[1] === undefined ? null : args[1];
  if (!isNode(node) || (child !== null && !isNode(child))) {
    throw new TypeError("The value is not a Node");
  }
  insertNode(element, node, child);
}
export function scrollOperation(element, args) {
  const state = requireElement(element);
  if (typeof args[0] === "object" && args[0] !== null) {
    if (args[0].left !== undefined) state.scrollLeft = finite(args[0].left);
    if (args[0].top !== undefined) state.scrollTop = finite(args[0].top);
  } else {
    state.scrollLeft = finite(args[0]);
    state.scrollTop = finite(args[1]);
  }
}
export function scrollByOperation(element, args) {
  const state = requireElement(element);
  if (typeof args[0] === "object" && args[0] !== null) {
    state.scrollLeft += finite(args[0].left);
    state.scrollTop += finite(args[0].top);
  } else {
    state.scrollLeft += finite(args[0]);
    state.scrollTop += finite(args[1]);
  }
}
export function noResultOperation() {}
export function setHTMLOperation(element, args) {
  setInnerHTML.call(element, args[0]);
}
export function ariaNotifyOperation() {}

function elementSibling(element, direction) {
  const state = requireNode(element);
  if (state.parent === null) return null;
  const siblings = requireNode(state.parent).children;
  let index = siblings.indexOf(element) + direction;
  while (index >= 0 && index < siblings.length) {
    const candidate = siblings[index];
    if (requireNode(candidate).nodeType === 1) return candidate;
    index += direction;
  }
  return null;
}

function insertAdjacent(element, positionValue, node) {
  const position = `${positionValue}`.toLowerCase();
  const state = requireNode(element);
  if (position === "beforebegin" || position === "afterend") {
    if (state.parent === null) return null;
    const siblings = requireNode(state.parent).children;
    const offset = position === "afterend" ? 1 : 0;
    const reference = siblings[siblings.indexOf(element) + offset] ?? null;
    insertNode(state.parent, node, reference);
    return node;
  }
  if (position === "afterbegin") {
    insertNode(element, node, state.children[0] ?? null);
    return node;
  }
  if (position === "beforeend") {
    insertNode(element, node);
    return node;
  }
  throw new DOMException(
    "The value provided is not one of 'beforebegin', 'afterbegin', 'beforeend', or 'afterend'.",
    "SyntaxError",
  );
}

function finite(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}
import { animationsForElement } from "../animation/animation-state.js";

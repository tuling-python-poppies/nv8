// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { elementExtendedMethod } from "./element-extended-method.js";
import {
  ariaNotifyOperation,
  checkVisibilityOperation,
  getAnimationsOperation,
  getElementsByTagNameNSOperation,
  getHTMLOperation,
  hasPointerCaptureOperation,
  insertAdjacentElementOperation,
  insertAdjacentHTMLOperation,
  insertAdjacentTextOperation,
  moveBeforeOperation,
  releasePointerCaptureOperation,
  scrollByOperation,
  noResultOperation,
  scrollOperation,
  setHTMLOperation,
  setPointerCaptureOperation,
} from "./element-extended-operations.js";
import { matchesAlgorithm } from "./selector-engine.js";

const ELEMENT_EXTENDED_METHOD_TABLE_ROWS = [
  ["ariaNotify", "ariaNotify", 1, ariaNotifyOperation],
  ["checkVisibility", "checkVisibility", 0, checkVisibilityOperation],
  ["getAnimations", "getAnimations", 0, getAnimationsOperation],
  ["getElementsByTagNameNS", "getElementsByTagNameNS", 2, getElementsByTagNameNSOperation],
  ["getHTML", "getHTML", 0, getHTMLOperation],
  ["hasPointerCapture", "hasPointerCapture", 1, hasPointerCaptureOperation],
  ["insertAdjacentElement", "insertAdjacentElement", 2, insertAdjacentElementOperation],
  ["insertAdjacentHTML", "insertAdjacentHTML", 2, insertAdjacentHTMLOperation],
  ["insertAdjacentText", "insertAdjacentText", 2, insertAdjacentTextOperation],
  ["moveBefore", "moveBefore", 2, moveBeforeOperation],
  ["releasePointerCapture", "releasePointerCapture", 1, releasePointerCaptureOperation],
  ["scroll", "scroll", 0, scrollOperation],
  ["scrollBy", "scrollBy", 0, scrollByOperation],
  ["scrollIntoView", "scrollIntoView", 0, noResultOperation],
  ["scrollIntoViewIfNeeded", "scrollIntoViewIfNeeded", 0, noResultOperation],
  ["scrollTo", "scrollTo", 0, scrollOperation],
  ["setHTML", "setHTML", 1, setHTMLOperation],
  ["setHTMLUnsafe", "setHTMLUnsafe", 1, setHTMLOperation],
  ["setPointerCapture", "setPointerCapture", 1, setPointerCaptureOperation],
  ["webkitMatchesSelector", "webkitMatchesSelector", 1, (element, args) => matchesAlgorithm(element, args[0])],
];

export const elementExtendedMethodTable = ELEMENT_EXTENDED_METHOD_TABLE_ROWS.map(
  ([name, ...args]) => [name, elementExtendedMethod(...args)],
);


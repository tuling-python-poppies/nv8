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

const ELEMENT_EXTENDED_METHOD_PART1_TABLE_ROWS = [
  ["checkVisibility", "checkVisibility", 0, checkVisibilityOperation],
];

export const elementExtendedMethodPart1Table = ELEMENT_EXTENDED_METHOD_PART1_TABLE_ROWS.map(
  ([name, ...args]) => [name, elementExtendedMethod(...args)],
);

const ELEMENT_EXTENDED_METHOD_PART2_TABLE_ROWS = [
  ["getAnimations", "getAnimations", 0, getAnimationsOperation],
];

export const elementExtendedMethodPart2Table = ELEMENT_EXTENDED_METHOD_PART2_TABLE_ROWS.map(
  ([name, ...args]) => [name, elementExtendedMethod(...args)],
);

const ELEMENT_EXTENDED_METHOD_PART3_TABLE_ROWS = [
  ["getElementsByTagNameNS", "getElementsByTagNameNS", 2, getElementsByTagNameNSOperation],
  ["getHTML", "getHTML", 0, getHTMLOperation],
];

export const elementExtendedMethodPart3Table = ELEMENT_EXTENDED_METHOD_PART3_TABLE_ROWS.map(
  ([name, ...args]) => [name, elementExtendedMethod(...args)],
);

const ELEMENT_EXTENDED_METHOD_PART4_TABLE_ROWS = [
  ["hasPointerCapture", "hasPointerCapture", 1, hasPointerCaptureOperation],
  ["insertAdjacentElement", "insertAdjacentElement", 2, insertAdjacentElementOperation],
  ["insertAdjacentHTML", "insertAdjacentHTML", 2, insertAdjacentHTMLOperation],
  ["insertAdjacentText", "insertAdjacentText", 2, insertAdjacentTextOperation],
];

export const elementExtendedMethodPart4Table = ELEMENT_EXTENDED_METHOD_PART4_TABLE_ROWS.map(
  ([name, ...args]) => [name, elementExtendedMethod(...args)],
);

const ELEMENT_EXTENDED_METHOD_PART5_TABLE_ROWS = [
  ["moveBefore", "moveBefore", 2, moveBeforeOperation],
];

export const elementExtendedMethodPart5Table = ELEMENT_EXTENDED_METHOD_PART5_TABLE_ROWS.map(
  ([name, ...args]) => [name, elementExtendedMethod(...args)],
);

const ELEMENT_EXTENDED_METHOD_PART6_TABLE_ROWS = [
  ["releasePointerCapture", "releasePointerCapture", 1, releasePointerCaptureOperation],
];

export const elementExtendedMethodPart6Table = ELEMENT_EXTENDED_METHOD_PART6_TABLE_ROWS.map(
  ([name, ...args]) => [name, elementExtendedMethod(...args)],
);

const ELEMENT_EXTENDED_METHOD_PART7_TABLE_ROWS = [
  ["scroll", "scroll", 0, scrollOperation],
  ["scrollBy", "scrollBy", 0, scrollByOperation],
  ["scrollIntoView", "scrollIntoView", 0, noResultOperation],
  ["scrollIntoViewIfNeeded", "scrollIntoViewIfNeeded", 0, noResultOperation],
  ["scrollTo", "scrollTo", 0, scrollOperation],
];

export const elementExtendedMethodPart7Table = ELEMENT_EXTENDED_METHOD_PART7_TABLE_ROWS.map(
  ([name, ...args]) => [name, elementExtendedMethod(...args)],
);

const ELEMENT_EXTENDED_METHOD_PART8_TABLE_ROWS = [
  ["setHTMLUnsafe", "setHTMLUnsafe", 1, setHTMLOperation],
  ["setPointerCapture", "setPointerCapture", 1, setPointerCaptureOperation],
];

export const elementExtendedMethodPart8Table = ELEMENT_EXTENDED_METHOD_PART8_TABLE_ROWS.map(
  ([name, ...args]) => [name, elementExtendedMethod(...args)],
);

const ELEMENT_EXTENDED_METHOD_PART9_TABLE_ROWS = [
  ["webkitMatchesSelector", "webkitMatchesSelector", 1, (element, args) => matchesAlgorithm(element, args[0])],
];

export const elementExtendedMethodPart9Table = ELEMENT_EXTENDED_METHOD_PART9_TABLE_ROWS.map(
  ([name, ...args]) => [name, elementExtendedMethod(...args)],
);

const ELEMENT_EXTENDED_METHOD_PART10_TABLE_ROWS = [
  ["ariaNotify", "ariaNotify", 1, ariaNotifyOperation],
];

export const elementExtendedMethodPart10Table = ELEMENT_EXTENDED_METHOD_PART10_TABLE_ROWS.map(
  ([name, ...args]) => [name, elementExtendedMethod(...args)],
);

const ELEMENT_EXTENDED_METHOD_PART11_TABLE_ROWS = [
  ["setHTML", "setHTML", 1, setHTMLOperation],
];

export const elementExtendedMethodPart11Table = ELEMENT_EXTENDED_METHOD_PART11_TABLE_ROWS.map(
  ([name, ...args]) => [name, elementExtendedMethod(...args)],
);

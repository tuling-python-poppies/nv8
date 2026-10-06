// dom 目录的成员实现：原本一个成员一个文件，合并以减少模块图节点。

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

export const ariaNotify = elementExtendedMethod("ariaNotify", 1, ariaNotifyOperation);
export const checkVisibility = elementExtendedMethod("checkVisibility", 0, checkVisibilityOperation);
export const getAnimations = elementExtendedMethod("getAnimations", 0, getAnimationsOperation);
export const getElementsByTagNameNS = elementExtendedMethod("getElementsByTagNameNS", 2, getElementsByTagNameNSOperation);
export const getHTML = elementExtendedMethod("getHTML", 0, getHTMLOperation);
export const hasPointerCapture = elementExtendedMethod("hasPointerCapture", 1, hasPointerCaptureOperation);
export const insertAdjacentElement = elementExtendedMethod("insertAdjacentElement", 2, insertAdjacentElementOperation);
export const insertAdjacentHTML = elementExtendedMethod("insertAdjacentHTML", 2, insertAdjacentHTMLOperation);
export const insertAdjacentText = elementExtendedMethod("insertAdjacentText", 2, insertAdjacentTextOperation);
export const moveBefore = elementExtendedMethod("moveBefore", 2, moveBeforeOperation);
export const releasePointerCapture = elementExtendedMethod("releasePointerCapture", 1, releasePointerCaptureOperation);
export const scroll = elementExtendedMethod("scroll", 0, scrollOperation);
export const scrollBy = elementExtendedMethod("scrollBy", 0, scrollByOperation);
export const scrollIntoView = elementExtendedMethod("scrollIntoView", 0, noResultOperation);
export const scrollIntoViewIfNeeded = elementExtendedMethod("scrollIntoViewIfNeeded", 0, noResultOperation);
export const scrollTo = elementExtendedMethod("scrollTo", 0, scrollOperation);
export const setHTML = elementExtendedMethod("setHTML", 1, setHTMLOperation);
export const setHTMLUnsafe = elementExtendedMethod("setHTMLUnsafe", 1, setHTMLOperation);
export const setPointerCapture = elementExtendedMethod("setPointerCapture", 1, setPointerCaptureOperation);
export const webkitMatchesSelector = elementExtendedMethod(
  "webkitMatchesSelector", 1, (element, args) => matchesAlgorithm(element, args[0]),
);

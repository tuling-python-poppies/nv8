// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { documentMethod } from "./document-method.js";
import {
  appendOperation,
  ariaNotifyOperation,
  browsingTopicsOperation,
  noResultOperation,
  caretPositionOperation,
  caretRangeOperation,
  clearOperation,
  closeOperation,
  createExpressionOperation,
  createNSResolverOperation,
  elementFromPointOperation,
  elementsFromPointOperation,
  evaluateOperation,
  execCommandOperation,
  exitFullscreenOperation,
  exitPictureInPictureOperation,
  exitPointerLockOperation,
  getAnimationsOperation,
  getElementsByNameOperation,
  getElementsByTagNameNSOperation,
  hasFocusOperation,
  resolvedFalseOperation,
  resolvedTrueOperation,
  moveBeforeDocumentOperation,
  openOperation,
  prependOperation,
  queryCommandEnabledOperation,
  falseOperation,
  queryCommandSupportedOperation,
  emptyStringOperation,
  replaceChildrenOperation,
  startViewTransitionOperation,
  writeOperation,
  writelnOperation,
} from "./document-extended-method-operations.js";

const DOCUMENT_METHOD_PART1_TABLE_ROWS = [
  ["append", "append", 0, appendOperation],
  ["captureEvents", "captureEvents", 0, noResultOperation],
  ["caretPositionFromPoint", "caretPositionFromPoint", 2, caretPositionOperation],
  ["caretRangeFromPoint", "caretRangeFromPoint", 0, caretRangeOperation],
  ["clear", "clear", 0, clearOperation],
  ["close", "close", 0, closeOperation],
];

export const documentMethodPart1Table = DOCUMENT_METHOD_PART1_TABLE_ROWS.map(
  ([name, ...args]) => [name, documentMethod(...args)],
);

const DOCUMENT_METHOD_PART2_TABLE_ROWS = [
  ["createExpression", "createExpression", 1, createExpressionOperation],
  ["createNSResolver", "createNSResolver", 1, createNSResolverOperation],
];

export const documentMethodPart2Table = DOCUMENT_METHOD_PART2_TABLE_ROWS.map(
  ([name, ...args]) => [name, documentMethod(...args)],
);

const DOCUMENT_METHOD_PART3_TABLE_ROWS = [
  ["elementFromPoint", "elementFromPoint", 2, elementFromPointOperation],
  ["elementsFromPoint", "elementsFromPoint", 2, elementsFromPointOperation],
  ["evaluate", "evaluate", 2, evaluateOperation],
  ["execCommand", "execCommand", 1, execCommandOperation],
  ["exitFullscreen", "exitFullscreen", 0, exitFullscreenOperation],
  ["exitPictureInPicture", "exitPictureInPicture", 0, exitPictureInPictureOperation],
  ["exitPointerLock", "exitPointerLock", 0, exitPointerLockOperation],
  ["getAnimations", "getAnimations", 0, getAnimationsOperation],
];

export const documentMethodPart3Table = DOCUMENT_METHOD_PART3_TABLE_ROWS.map(
  ([name, ...args]) => [name, documentMethod(...args)],
);

const DOCUMENT_METHOD_PART4_TABLE_ROWS = [
  ["getElementsByName", "getElementsByName", 1, getElementsByNameOperation],
];

export const documentMethodPart4Table = DOCUMENT_METHOD_PART4_TABLE_ROWS.map(
  ([name, ...args]) => [name, documentMethod(...args)],
);

const DOCUMENT_METHOD_PART5_TABLE_ROWS = [
  ["getElementsByTagNameNS", "getElementsByTagNameNS", 2, getElementsByTagNameNSOperation],
];

export const documentMethodPart5Table = DOCUMENT_METHOD_PART5_TABLE_ROWS.map(
  ([name, ...args]) => [name, documentMethod(...args)],
);

const DOCUMENT_METHOD_PART6_TABLE_ROWS = [
  ["hasFocus", "hasFocus", 0, hasFocusOperation],
  ["hasStorageAccess", "hasStorageAccess", 0, resolvedTrueOperation],
];

export const documentMethodPart6Table = DOCUMENT_METHOD_PART6_TABLE_ROWS.map(
  ([name, ...args]) => [name, documentMethod(...args)],
);

const DOCUMENT_METHOD_PART7_TABLE_ROWS = [
  ["hasUnpartitionedCookieAccess", "hasUnpartitionedCookieAccess", 0, resolvedTrueOperation],
];

export const documentMethodPart7Table = DOCUMENT_METHOD_PART7_TABLE_ROWS.map(
  ([name, ...args]) => [name, documentMethod(...args)],
);

const DOCUMENT_METHOD_PART8_TABLE_ROWS = [
  ["moveBefore", "moveBefore", 2, moveBeforeDocumentOperation],
  ["open", "open", 0, openOperation],
  ["prepend", "prepend", 0, prependOperation],
  ["queryCommandEnabled", "queryCommandEnabled", 1, queryCommandEnabledOperation],
  ["queryCommandIndeterm", "queryCommandIndeterm", 1, falseOperation],
  ["queryCommandState", "queryCommandState", 1, falseOperation],
  ["queryCommandSupported", "queryCommandSupported", 1, queryCommandSupportedOperation],
  ["queryCommandValue", "queryCommandValue", 1, emptyStringOperation],
];

export const documentMethodPart8Table = DOCUMENT_METHOD_PART8_TABLE_ROWS.map(
  ([name, ...args]) => [name, documentMethod(...args)],
);

const DOCUMENT_METHOD_PART9_TABLE_ROWS = [
  ["releaseEvents", "releaseEvents", 0, noResultOperation],
  ["replaceChildren", "replaceChildren", 0, replaceChildrenOperation],
  ["requestStorageAccess", "requestStorageAccess", 0, resolvedTrueOperation],
  ["requestStorageAccessFor", "requestStorageAccessFor", 1, resolvedTrueOperation],
  ["startViewTransition", "startViewTransition", 0, startViewTransitionOperation],
  ["webkitCancelFullScreen", "webkitCancelFullScreen", 0, exitFullscreenOperation],
  ["webkitExitFullscreen", "webkitExitFullscreen", 0, exitFullscreenOperation],
  ["write", "write", 0, writeOperation],
  ["writeln", "writeln", 0, writelnOperation],
];

export const documentMethodPart9Table = DOCUMENT_METHOD_PART9_TABLE_ROWS.map(
  ([name, ...args]) => [name, documentMethod(...args)],
);

const DOCUMENT_METHOD_PART10_TABLE_ROWS = [
  ["browsingTopics", "browsingTopics", 0, browsingTopicsOperation],
  ["hasPrivateToken", "hasPrivateToken", 1, resolvedFalseOperation],
  ["hasRedemptionRecord", "hasRedemptionRecord", 1, resolvedFalseOperation],
];

export const documentMethodPart10Table = DOCUMENT_METHOD_PART10_TABLE_ROWS.map(
  ([name, ...args]) => [name, documentMethod(...args)],
);

const DOCUMENT_METHOD_PART11_TABLE_ROWS = [
  ["ariaNotify", "ariaNotify", 1, ariaNotifyOperation],
];

export const documentMethodPart11Table = DOCUMENT_METHOD_PART11_TABLE_ROWS.map(
  ([name, ...args]) => [name, documentMethod(...args)],
);


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

export const append = documentMethod("append", 0, appendOperation);
export const ariaNotify = documentMethod("ariaNotify", 1, ariaNotifyOperation);
export const browsingTopics = documentMethod("browsingTopics", 0, browsingTopicsOperation);
export const captureEvents = documentMethod("captureEvents", 0, noResultOperation);
export const caretPositionFromPoint = documentMethod("caretPositionFromPoint", 2, caretPositionOperation);
export const caretRangeFromPoint = documentMethod("caretRangeFromPoint", 0, caretRangeOperation);
export const clear = documentMethod("clear", 0, clearOperation);
export const close = documentMethod("close", 0, closeOperation);
export const createExpression = documentMethod("createExpression", 1, createExpressionOperation);
export const createNSResolver = documentMethod("createNSResolver", 1, createNSResolverOperation);
export const elementFromPoint = documentMethod("elementFromPoint", 2, elementFromPointOperation);
export const elementsFromPoint = documentMethod("elementsFromPoint", 2, elementsFromPointOperation);
export const evaluate = documentMethod("evaluate", 2, evaluateOperation);
export const execCommand = documentMethod("execCommand", 1, execCommandOperation);
export const exitFullscreen = documentMethod("exitFullscreen", 0, exitFullscreenOperation);
export const exitPictureInPicture = documentMethod("exitPictureInPicture", 0, exitPictureInPictureOperation);
export const exitPointerLock = documentMethod("exitPointerLock", 0, exitPointerLockOperation);
export const getAnimations = documentMethod("getAnimations", 0, getAnimationsOperation);
export const getElementsByName = documentMethod("getElementsByName", 1, getElementsByNameOperation);
export const getElementsByTagNameNS = documentMethod("getElementsByTagNameNS", 2, getElementsByTagNameNSOperation);
export const hasFocus = documentMethod("hasFocus", 0, hasFocusOperation);
export const hasPrivateToken = documentMethod("hasPrivateToken", 1, resolvedFalseOperation);
export const hasRedemptionRecord = documentMethod("hasRedemptionRecord", 1, resolvedFalseOperation);
export const hasStorageAccess = documentMethod("hasStorageAccess", 0, resolvedTrueOperation);
export const hasUnpartitionedCookieAccess = documentMethod("hasUnpartitionedCookieAccess", 0, resolvedTrueOperation);
export const moveBefore = documentMethod("moveBefore", 2, moveBeforeDocumentOperation);
export const open = documentMethod("open", 0, openOperation);
export const prepend = documentMethod("prepend", 0, prependOperation);
export const queryCommandEnabled = documentMethod("queryCommandEnabled", 1, queryCommandEnabledOperation);
export const queryCommandIndeterm = documentMethod("queryCommandIndeterm", 1, falseOperation);
export const queryCommandState = documentMethod("queryCommandState", 1, falseOperation);
export const queryCommandSupported = documentMethod("queryCommandSupported", 1, queryCommandSupportedOperation);
export const queryCommandValue = documentMethod("queryCommandValue", 1, emptyStringOperation);
export const releaseEvents = documentMethod("releaseEvents", 0, noResultOperation);
export const replaceChildren = documentMethod("replaceChildren", 0, replaceChildrenOperation);
export const requestStorageAccess = documentMethod("requestStorageAccess", 0, resolvedTrueOperation);
export const requestStorageAccessFor = documentMethod("requestStorageAccessFor", 1, resolvedTrueOperation);
export const startViewTransition = documentMethod("startViewTransition", 0, startViewTransitionOperation);
export const webkitCancelFullScreen = documentMethod("webkitCancelFullScreen", 0, exitFullscreenOperation);
export const webkitExitFullscreen = documentMethod("webkitExitFullscreen", 0, exitFullscreenOperation);
export const write = documentMethod("write", 0, writeOperation);
export const writeln = documentMethod("writeln", 0, writelnOperation);

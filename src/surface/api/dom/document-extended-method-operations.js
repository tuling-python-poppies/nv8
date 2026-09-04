import { animationsForDocument } from "../animation/animation-state.js";
import { createViewTransition } from "../view-transition/view-transition-state.js";
import { moveBeforeOperation } from "./element-extended-operations.js";
import { parseFragment, parsePageHTML } from "./html-parser.js";
import {
  appendAlgorithm,
  prependAlgorithm,
  replaceChildrenAlgorithm,
} from "./parent-node-algorithms.js";
import { Event } from "../event/event-constructor.js";
import { ensureEventTarget } from "../event/event-target-dispatch-event.js";
import { insertNode, requireNode } from "./node-state.js";
import {
  documentBody,
  documentCollection,
  documentElements,
  requireDocument,
  setDocumentReadyState,
} from "./document-record.js";
import { createRange } from "./range-constructor.js";
import { lookupNamespaceURI } from "./xpath-ns-resolver-callback.js";
import {
  createCaretPosition,
  createXPathExpression,
  evaluateXPath,
} from "../dom-utilities/dom-utilities-runtime.js";

export function appendOperation(document, args) { appendAlgorithm(document, args); }
export function prependOperation(document, args) { prependAlgorithm(document, args); }
export function replaceChildrenOperation(document, args) { replaceChildrenAlgorithm(document, args); }
export function moveBeforeDocumentOperation(document, args) { moveBeforeOperation(document, args); }
export function noResultOperation(document) { requireDocument(document); }
export function caretPositionOperation(document, args) {
  requireDocument(document);
  return createCaretPosition(documentBody(document), 0);
}
export function caretRangeOperation(document) {
  const range = createRange(document);
  const body = documentBody(document);
  if (body !== null) range.setStart(body, 0);
  range.collapse(true);
  return range;
}
export function clearOperation(document) {
  const body = documentBody(document);
  if (body !== null) replaceChildrenAlgorithm(body, []);
}
export function closeOperation(document) {
  const state = requireDocument(document);
  if (state.writeOpen !== true) return;
  const source = state.writeBuffer ?? "";
  state.writeBuffer = "";
  state.writeOpen = false;
  parsePageHTML(source);
  const reload = state.pageReload;
  if (typeof reload === "function") {
    void reload(document);
    return;
  }
  setDocumentReadyState(document, "interactive");
  // DOMContentLoaded 在 document 上派发并**冒泡**到 window。真实 Edge 实测：
  //   ["document:DCL", "window:DCL", "window:load"]
  // 不带 bubbles 会让 `window.addEventListener('DOMContentLoaded')` 永远收不到。
  ensureEventTarget(globalThis);
  document.dispatchEvent(new Event("DOMContentLoaded", { bubbles: true }));
  setDocumentReadyState(document, "complete");
  // load 只在 window 上派发。派到 document 上既让 window 监听器收不到，
  // 又让真实浏览器不会触发的 document 监听器被触发——两头都错。
  globalThis.dispatchEvent(new Event("load"));
}
/**
 * `document.open()`
 *
 * 规范要求它**替换整个文档**：移除所有子节点，重建一个空的
 * `<html><head></head><body></body></html>` 骨架，readyState 置为 `loading`。
 *
 * 迁移前只改了 readyState 和返回值，没清空文档。后果是
 * `document.open(); document.write(...); document.close()` 把新内容**追加**
 * 到旧文档而不是替换它——最常见的 `open/write/close` 用法完全不符合预期。
 */
export function openOperation(document) {
  const state = requireDocument(document);

  // 1. 移除所有子节点（含旧的 documentElement 与 doctype）
  replaceChildrenAlgorithm(document, []);

  // 2. 重建空骨架。浏览器在 open() 返回后立刻就有 html/head/body 可用，
  //    write() 之前访问 document.body 不应是 null。
  const documentElement = document.createElement('html');
  const head = document.createElement('head');
  const body = document.createElement('body');
  appendAlgorithm(documentElement, [head]);
  appendAlgorithm(documentElement, [body]);
  appendAlgorithm(document, [documentElement]);

  // 3. 进入写入模式
  state.writeOpen = true;
  state.writeBuffer = '';
  setDocumentReadyState(document, 'loading');
  return document;
}
export function createExpressionOperation(document, args) {
  requireDocument(document);
  return createXPathExpression(document, args[0]);
}
export function createNSResolverOperation(document) {
  requireDocument(document);
  return lookupNamespaceURI;
}
export function elementFromPointOperation(document) { requireDocument(document); return null; }
export function elementsFromPointOperation(document) { requireDocument(document); return []; }
export function evaluateOperation(document, args) {
  return evaluateXPath(document, `${args[0]}`, args[1] ?? document, args[3]);
}
export function execCommandOperation(document) { requireDocument(document); return false; }
export function exitFullscreenOperation(document) {
  requireDocument(document).fullscreenElement = null;
  return Promise.resolve();
}
export function exitPictureInPictureOperation(document) { requireDocument(document); return Promise.resolve(); }
export function exitPointerLockOperation(document) { requireDocument(document).pointerLockElement = null; }
export function getAnimationsOperation(document) { return animationsForDocument(document); }
export function getElementsByNameOperation(document, args) {
  const name = `${args[0]}`;
  return documentCollection(document, `name:${name}`, () =>
    documentElements(document).filter(element => element.getAttribute("name") === name));
}
export function getElementsByTagNameNSOperation(document, args) {
  const namespace = args[0] === null ? null : `${args[0]}`;
  const localName = `${args[1]}`;
  return documentCollection(document, `tagNS:${namespace}:${localName}`, () =>
    documentElements(document).filter(element =>
      (namespace === "*" || element.namespaceURI === namespace)
      && (localName === "*" || element.localName === localName)));
}
export function hasFocusOperation(document) { requireDocument(document); return true; }
export function resolvedTrueOperation(document) { requireDocument(document); return Promise.resolve(true); }
export function queryCommandEnabledOperation(document, args) {
  requireDocument(document);
  return ["copy", "cut", "paste", "selectAll"].includes(`${args[0]}`.toLowerCase());
}
export function falseOperation(document) { requireDocument(document); return false; }
export function queryCommandSupportedOperation(document, args) {
  requireDocument(document);
  return ["copy", "cut", "paste", "selectall", "bold", "italic", "underline"].includes(`${args[0]}`.toLowerCase());
}
export function emptyStringOperation(document) { requireDocument(document); return ""; }
export function startViewTransitionOperation(document, args) {
  const state = requireDocument(document);
  const transition = createViewTransition(document, args[0]);
  state.activeViewTransition = transition;
  return transition;
}
export function writeOperation(document, args) {
  const state = requireDocument(document);
  const source = args.map(value => `${value}`).join("");
  if (state.writeOpen === true) {
    state.writeBuffer = `${state.writeBuffer ?? ""}${source}`;
    return;
  }
  const insertionPoint = state.parserInsertionPoint ?? null;
  if (insertionPoint !== null) {
    const { parent, reference } = insertionPoint;
    const currentReference = reference !== null
      && requireNode(reference).parent === parent
      ? reference
      : null;
    const fragment = parseFragment(document, source, parent);
    insertNode(parent, fragment, currentReference);
    return;
  }
  const body = documentBody(document);
  if (body === null) return;
  const fragment = parseFragment(
    document,
    source,
    body,
    state.parserScriptExecutor,
  );
  appendAlgorithm(body, [...fragment.childNodes]);
}
export function writelnOperation(document, args) { writeOperation(document, [...args, "\n"]); }
export function browsingTopicsOperation(document) { requireDocument(document); return Promise.resolve([]); }
export function resolvedFalseOperation(document) { requireDocument(document); return Promise.resolve(false); }
export function ariaNotifyOperation(document, args) {
  requireDocument(document);
  if (args.length === 0) throw new TypeError("1 argument required");
}

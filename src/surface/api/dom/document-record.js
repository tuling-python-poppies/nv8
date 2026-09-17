import { assignEventHandler } from "../event/event-handler-attribute.js";
import { currentHref } from "../../../infra/navigation/navigation-state.js";
import { initializeEventTarget } from "../event/event-target-state.js";
import { createHTMLCollection } from "./html-collection-state.js";
import { createHTMLElement } from "./html-element-constructor.js";
import {
  descendants,
  DOCUMENT_NODE,
  initializeNode,
  insertNode,
  requireNode,
} from "./node-state.js";
import { Document } from "./document-constructor.js";
import { setActiveDocument } from "./document-state.js";

const documentState = new WeakMap();

export function createDocument() {
  const prototype = typeof globalThis.HTMLDocument === "function"
    ? globalThis.HTMLDocument.prototype
    : Document.prototype;
  const document = initializeDocument(
    prototype,
    "text/html",
    currentHref(),
  );
  setActiveDocument(document);
  appendHTMLStructure(document);
  defineLocation(document);
  return document;
}

/**
 * `new Document()` —— 构造一个空的 XML 文档。
 *
 * 真实 Edge 151 实测：
 *
 * ```json
 * { "tag": "[object Document]", "contentType": "application/xml",
 *   "URL": "about:blank", "readyState": "complete",
 *   "documentElement": "null", "childNodes": 0,
 *   "isHTMLDocument": false, "proto": "Document.prototype" }
 * ```
 *
 * 三个容易搞错的点：
 * - 原型是 `Document.prototype`，**不是** `HTMLDocument.prototype`
 * - contentType 是 `application/xml`（DOM 规范：`new Document()` 造的是 XML 文档）
 * - 完全空文档，没有 documentElement，`readyState` 直接是 `complete`
 *
 * 迁移前 `new Document()` 直接抛 Illegal constructor，而真实浏览器允许构造。
 *
 * @returns {object}
 */
export function constructXMLDocument() {
  const document = initializeDocument(
    Document.prototype,
    "application/xml",
    "about:blank",
  );
  // 空文档不参与页面生命周期，一创建就是 complete
  requireDocument(document).readyState = "complete";
  return document;
}

export function createDetachedHTMLDocument(title, hasTitle) {
  const prototype = typeof globalThis.HTMLDocument === "function"
    ? globalThis.HTMLDocument.prototype
    : Document.prototype;
  const document = initializeDocument(
    prototype,
    "text/html",
    "about:blank",
  );
  const { head } = appendHTMLStructure(document);
  if (hasTitle) {
    const titleElement = createHTMLElement("title", document);
    titleElement.appendChild(document.createTextNode(`${title}`));
    insertNode(head, titleElement);
  }
  return document;
}

export function createXMLDocument() {
  const prototype = typeof globalThis.XMLDocument === "function"
    ? globalThis.XMLDocument.prototype
    : Document.prototype;
  return initializeDocument(
    prototype,
    "application/xml",
    "about:blank",
  );
}

function initializeDocument(prototype, contentType, url) {
  const document = Object.create(prototype);
  initializeNode(document, DOCUMENT_NODE, "#document", null, null);
  initializeEventTarget(document);
  documentState.set(document, {
    URL: url,
    compatMode: "CSS1Compat",
    characterSet: "UTF-8",
    contentType,
    // 真实浏览器的 document 一创建就是 loading；parsePageHTML 解析完成后
    // 由生命周期推进到 interactive → complete。初始值写 complete 会让
    // parser 阶段的 inline 脚本观测到 complete——正常页面不可能出现。
    readyState: "loading",
    referrer: "",
    cookie: "",
    collections: new Map(),
    fullscreenElement: null,
    pointerLockElement: null,
    handlers: new Map(),
    designMode: "off",
    adoptedStyleSheets: [],
    activeViewTransition: null,
    parserExecutedScripts: new WeakSet(),
  });
  return document;
}

function appendHTMLStructure(document) {
  const html = createHTMLElement("html", document);
  const head = createHTMLElement("head", document);
  const body = createHTMLElement("body", document);
  insertNode(document, html);
  insertNode(html, head);
  insertNode(html, body);
  return { html, head, body };
}

function defineLocation(document) {
  Object.defineProperty(document, "location", {
    get() {
      return globalThis.location;
    },
    set(value) {
      globalThis.location = value;
    },
    enumerable: true,
    configurable: false,
  });
}

export function requireDocument(value) {
  const state = documentState.get(value);
  if (state === undefined) {
    throw new TypeError("Illegal invocation");
  }
  return state;
}

export function configureDocument(referrer, contentType) {
  const document = currentDocumentValue();
  if (document === null) {
    return;
  }
  const state = requireDocument(document);
  state.referrer = `${referrer}`;
  state.contentType = `${contentType}`;
}

export function setCurrentScript(document, script) {
  requireDocument(document).currentScript = script;
}

export function setDocumentPageReload(document, callback) {
  requireDocument(document).pageReload = typeof callback === "function"
    ? callback
    : null;
}

export function setDocumentParserScriptExecutor(document, callback) {
  requireDocument(document).parserScriptExecutor = typeof callback === "function"
    ? callback
    : null;
}

export function setDocumentParserFragment(document, fragment) {
  const state = requireDocument(document);
  state.parserFragment = fragment;
  state.parserVisibleNodes = fragment === null ? null : new Set();
}

export function markDocumentParserNode(document, node) {
  try {
    const visible = requireDocument(document).parserVisibleNodes;
    visible?.add(node);
  } catch {
    // Detached parser test documents do not have Document state.
  }
}

export function setDocumentParserInsertionPoint(document, script) {
  const state = requireDocument(document);
  if (script === null) {
    state.parserInsertionPoint = null;
    return;
  }
  const scriptState = requireNode(script);
  const parent = scriptState.parent;
  if (parent === null) {
    state.parserInsertionPoint = null;
    return;
  }
  const siblings = requireNode(parent).children;
  state.parserInsertionPoint = {
    parent,
    reference: siblings[siblings.indexOf(script) + 1] ?? null,
  };
}

export function setDocumentReadyState(document, value) {
  requireDocument(document).readyState = `${value}`;
}

export function currentScriptOf(document) {
  return requireDocument(document).currentScript ?? null;
}

export function documentElementOf(document) {
  const state = requireDocument(document);
  return requireNode(document).children.find(
    child => requireNode(child).nodeType === 1,
  )
    ?? state.parserFragment?.children?.find(
      child => requireNode(child).nodeType === 1,
    )
    ?? null;
}

export function documentHead(document) {
  return documentElements(document).find(
    element => element.localName === "head",
  ) ?? null;
}

export function documentBody(document) {
  return documentElements(document).find(
    element => element.localName === "body",
  ) ?? null;
}

export function documentElements(document) {
  const state = requireDocument(document);
  const values = descendants(document);
  if (state.parserFragment !== null && state.parserFragment !== undefined) {
    values.push(...descendants(state.parserFragment));
  }
  return values.filter(node => (
    requireNode(node).nodeType === 1
    && (state.parserVisibleNodes === null
      || state.parserVisibleNodes === undefined
      || state.parserVisibleNodes.has(node))
  ));
}

export function documentCollection(document, key, source) {
  const state = requireDocument(document);
  let collection = state.collections.get(key);
  if (collection === undefined) {
    collection = createHTMLCollection(source);
    state.collections.set(key, collection);
  }
  return collection;
}

export function setDocumentInteractionElement(document, name, element) {
  requireDocument(document)[name] = element;
}

export function documentHandler(document, name) {
  return requireDocument(document).handlers.get(name) ?? null;
}

export function setDocumentHandler(document, name, value) {
  const state = requireDocument(document);
  // 与 element 相同：处理器要注册成真正的监听器才会在派发时被调用。
  state.handlerListeners ??= new Map();
  assignEventHandler(document, state.handlers, state.handlerListeners, name, value);
}

function currentDocumentValue() {
  for (const candidate of [globalThis.document]) {
    if (candidate !== undefined && documentState.has(candidate)) {
      return candidate;
    }
  }
  return null;
}

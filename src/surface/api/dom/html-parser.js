import { currentDocument } from "./document-state.js";
import { ensureEventTarget } from "../event/event-target-dispatch-event.js";
import {
  setCurrentScript,
  setDocumentParserInsertionPoint,
  requireDocument,
  setDocumentParserFragment,
  markDocumentParserNode,
  setDocumentReadyState,
} from "./document-record.js";
import { createDocumentType } from "./document-type-state.js";
import {
  HTML_NAMESPACE,
  MATHML_NAMESPACE,
  SVG_NAMESPACE,
} from "./element-state.js";
import {
  insertNode,
  removeNode,
  requireNode,
} from "./node-state.js";

const voidElements = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);
const headElements = new Set([
  "base",
  "basefont",
  "bgsound",
  "link",
  "meta",
  "noframes",
  "script",
  "style",
  "template",
  "title",
]);
const rawTextElements = new Set(["script", "style", "textarea", "title"]);

/**
 * 解析 HTML。
 *
 * 两种模式：
 *
 * - **fragment**（默认）：节点建在一个 DocumentFragment 里，调用方自行处理。
 *   `innerHTML` 等走这条路。
 * - **streaming**（`streamingDocument` 非 null）：节点**直接插入 document**，
 *   遇到 `<script>` 就地执行。这是页面解析该有的语义——脚本运行时只能看到
 *   自己之前的 DOM。
 *
 * 两种模式共用同一个 tokenizer；区别只在插入位置的决策，见
 * `ensureStreamingParent()`。
 *
 * @param {object} document
 * @param {string} source
 * @param {object|null} contextElement
 * @param {Function|null} parserScriptExecutor 遇到 script 时的执行器
 * @param {boolean} exposeToDocument fragment 模式下让 document 查询穿透到 fragment
 * @param {object|null} streamingDocument 提供时启用 streaming 模式
 * @returns {object} fragment 模式返回 fragment；streaming 模式返回 document
 */
export function parseFragment(
  document,
  source,
  contextElement = null,
  parserScriptExecutor = null,
  exposeToDocument = false,
  streamingDocument = null,
) {
  const input = `${source}`;
  const streaming = streamingDocument !== null;
  const fragment = streaming ? streamingDocument : document.createDocumentFragment();
  if (exposeToDocument && !streaming) setDocumentParserFragment(document, fragment);
  const stack = [fragment];
  const stackNames = [""];
  let index = 0;
  while (index < input.length) {
    // Handle XML declarations and processing instructions: <?...?>
    if (input.startsWith("<?xml", index) || input.startsWith("<?", index)) {
      const end = input.indexOf("?>", index + 2);
      if (end < 0) {
        // Malformed processing instruction, skip the rest
        index = input.length;
        break;
      }
      // Skip processing instruction entirely
      index = end + 2;
      continue;
    }
    if (input.startsWith("<!--", index)) {
      const end = input.indexOf("-->", index + 4);
      const stop = end < 0 ? input.length : end;
      stack.at(-1).appendChild(document.createComment(input.slice(index + 4, stop)));
      index = end < 0 ? input.length : end + 3;
      continue;
    }
    if (/^<!doctype\s/iu.test(input.slice(index, index + 12))) {
      const end = input.indexOf(">", index + 2);
      const token = input.slice(index + 2, end < 0 ? input.length : end);
      const match = /^doctype\s+([^\s>]+)/iu.exec(token);
      if (match !== null) {
        stack.at(-1).appendChild(createDocumentType(match[1], document));
      }
      index = end < 0 ? input.length : end + 1;
      continue;
    }
    if (input.startsWith("</", index)) {
      const end = input.indexOf(">", index + 2);
      if (end < 0) {
        break;
      }
      const name = input.slice(index + 2, end).trim().split(/\s/u, 1)[0].toLowerCase();
      for (let depth = stack.length - 1; depth > 0; depth -= 1) {
        if (stackNames[depth] === name) {
          stack.length = depth;
          stackNames.length = depth;
          break;
        }
      }
      index = end + 1;
      continue;
    }
    if (input[index] === "<" && /[A-Za-z]/u.test(input[index + 1] ?? "")) {
      const end = findTagEnd(input, index + 1);
      if (end < 0) {
        appendText(document, stack.at(-1), input.slice(index));
        break;
      }
      let token = input.slice(index + 1, end);
      const selfClosing = /\/\s*$/u.test(token);
      if (selfClosing) {
        token = token.replace(/\/\s*$/u, "");
      }
      const nameMatch = /^([^\s/>]+)/u.exec(token);
      if (nameMatch === null) {
        appendText(document, stack.at(-1), "<");
        index += 1;
        continue;
      }
      const name = nameMatch[1].toLowerCase();
      if (streaming) {
        ensureStreamingParent(document, stack, stackNames, name);
      }
      const namespace = namespaceFor(
        document,
        stack.at(-1),
        contextElement,
        name,
      );
      const element = namespace === HTML_NAMESPACE
        ? document.createElement(name)
        : document.createElementNS(namespace, name);
      markDocumentParserNode(document, element);
      parseAttributes(token.slice(nameMatch[0].length), (attrName, value) => {
        element.setAttribute(attrName, decodeEntities(value));
      });
      stack.at(-1).appendChild(element);
      index = end + 1;
      if (rawTextElements.has(name) && !selfClosing) {
        const closeExpression = new RegExp(`</${name}\\s*>`, "igu");
        closeExpression.lastIndex = index;
        const close = closeExpression.exec(input);
        const raw = input.slice(index, close === null ? input.length : close.index);
        element.appendChild(
          document.createTextNode(
            name === "textarea" || name === "title" ? decodeEntities(raw) : raw,
          ),
        );
        index = close === null ? input.length : closeExpression.lastIndex;
        if (name === "script") parserScriptExecutor?.(element);
      } else if (!selfClosing && !voidElements.has(name)) {
        stack.push(name === "template" ? element.content : element);
        stackNames.push(name);
      }
      continue;
    }
    const next = input.indexOf("<", index);
    const stop = next < 0 ? input.length : next;
    const text = decodeEntities(input.slice(index, stop));
    if (streaming && text.trim() !== "") {
      // 只有非空白文本才强制打开 body。`<html>\n<head>` 之间的换行不该
      // 提前创建 body——那会让 head 里的脚本看到 document.body 已存在。
      ensureStreamingParent(document, stack, stackNames, null);
    }
    appendText(document, stack.at(-1), text);
    index = stop;
  }
  return fragment;
}

/**
 * streaming 模式下确定元素该插到哪里，必要时补建 `html` / `head` / `body`。
 *
 * 这是真实浏览器 insertion mode 的简化版。核心约束：**不能预建 body**。
 * 真实浏览器解析到 `<body>`（或第一个 body 内容）之前 `document.body` 是
 * `null`，head 里的脚本依赖这一点。
 *
 * @param {object} document
 * @param {object[]} stack
 * @param {string[]} stackNames
 * @param {string|null} name 元素名；null 表示文本内容
 */
function ensureStreamingParent(document, stack, stackNames, name) {
  // 在 document 层：先确保 documentElement 存在
  if (stack.length === 1) {
    if (name === "html") return;
    const html = findOrCreateChild(document, document, "html");
    stack.push(html);
    stackNames.push("html");
  }

  // 在 html 层：决定进 head 还是 body
  if (stackNames.at(-1) === "html") {
    if (name === "head" || name === "body") return;
    const html = stack.at(-1);
    if (name !== null && headElements.has(name)) {
      const head = findOrCreateChild(document, html, "head");
      stack.push(head);
      stackNames.push("head");
      return;
    }
    // body 内容：head 必须先存在，否则 head 会排到 body 后面
    findOrCreateChild(document, html, "head");
    const body = findOrCreateChild(document, html, "body");
    stack.push(body);
    stackNames.push("body");
  }
}

/**
 * 取 parent 下指定名字的子元素，不存在则创建。
 *
 * @param {object} document
 * @param {object} parent
 * @param {string} name
 * @returns {object}
 */
function findOrCreateChild(document, parent, name) {
  const existing = requireNode(parent).children.find(
    node => node.localName === name,
  );
  if (existing !== undefined) return existing;
  const created = document.createElement(name);
  markDocumentParserNode(document, created);
  insertNode(parent, created);
  return created;
}

/**
 * 解析页面 HTML 到当前 document。
 *
 * 采用**流式**语义：节点直接插入 document，遇到 parser-blocking 脚本就地
 * 执行。因此脚本运行时只能看到自己之前的 DOM，`document.readyState` 为
 * `'loading'`。
 *
 * 迁移前是 one-shot：整个文档先解析到 fragment、组装到 document，**然后**才
 * 批量执行 inline 脚本。脚本因此看到完整 DOM 且 readyState 已是 `'complete'`。
 * 大量反爬与指纹脚本依赖「我运行时后面的 DOM 还不存在」，而正常页面里
 * inline 脚本绝不可能在 complete 状态下首次运行。
 *
 * @param {string} source
 */
export function parsePageHTML(source) {
  const document = currentDocument();
  if (document === null) {
    return;
  }

  // 解析期间 readyState 必须是 'loading'。document 创建时的默认值也是
  // 'loading'（见 document-record.js），这里显式重置是因为 document.open()
  // 与页面重载会复用同一个 document。
  setDocumentReadyState(document, "loading");

  for (const child of requireNode(document).children.slice()) {
    removeNode(document, child);
  }

  const executor = requireDocument(document).parserScriptExecutor;
  const scriptRunner = typeof executor === "function"
    ? executor
    : script => executeInlineScript(document, script);

  parseFragment(document, source, null, scriptRunner, false, document);

  // 真实浏览器的文档总有 html/head/body，即使源码里一个都没写。
  // 流式解析只在遇到内容时才建它们，所以空文档需要在这里补齐。
  ensureDocumentSkeleton(document);
  setDocumentParserFragment(document, null);

  if (typeof executor !== "function") {
    // 没有宿主侧执行器 = legacy 模式，parser 自己收尾。
    //
    // plugin 模式下生命周期由 realm-factory / sandbox 的
    // completePageLifecycle() 推进，因为它还要等 defer/module/async
    // 脚本跑完。legacy 模式没有那套机制，且宿主侧拿不到这个 document
    // ——它由 Realm 内的模块实例持有，跟宿主通过 RealmModuleLoader
    // 拿到的那份 `document-state.js` 不是同一个。
    finishParserLifecycle(document);
  }
}

/**
 * legacy 模式下的解析收尾：readyState 推进 + DOMContentLoaded/load。
 *
 * 排到后续任务而不是同步执行：真实浏览器里 DOMContentLoaded 是解析完成
 * 后的独立任务；同步派发会让它早于 legacy bootstrap 剩下的安装步骤
 * （installEdgeStaticFunctions 等），监听器里访问的全局可能还没装好。
 *
 * @param {object} document
 */
function finishParserLifecycle(document) {
  const schedule = typeof globalThis.setTimeout === "function"
    ? callback => globalThis.setTimeout(callback, 0)
    : callback => Promise.resolve().then(callback);

  schedule(() => {
    if (typeof globalThis.Event !== "function") return;
    ensureEventTarget(globalThis);

    setDocumentReadyState(document, "interactive");
    // DOMContentLoaded 在 document 上派发并**冒泡**到 window。只派一次；
    // 再在 window 上补一次会让 window 监听器触发两次。
    document.dispatchEvent?.(
      new globalThis.Event("DOMContentLoaded", { bubbles: true }),
    );

    setDocumentReadyState(document, "complete");
    // load 只在 window 上派发且不冒泡。真实 Edge 实测确认
    // `document.addEventListener('load')` 从不触发，因此不往 document 补派。
    globalThis.dispatchEvent?.(new globalThis.Event("load"));
  });
}

/**
 * 确保 document 有 html/head/body 三层骨架。
 *
 * @param {object} document
 */
function ensureDocumentSkeleton(document) {
  const children = requireNode(document).children;
  let html = children.find(
    node => requireNode(node).nodeType === 1 && node.localName === "html",
  );
  if (html === undefined) {
    html = document.createElement("html");
    markDocumentParserNode(document, html);
    insertNode(document, html);
  }
  ensureHeadAndBody(document, html);
}

function ensureHeadAndBody(document, html) {
  const children = requireNode(html).children;
  let head = children.find(node => node.localName === "head");
  let body = children.find(node => node.localName === "body");
  if (head === undefined) {
    head = document.createElement("head");
    insertNode(html, head, children[0] ?? null);
  }
  if (body === undefined) {
    body = document.createElement("body");
    insertNode(html, body);
  }
}

function executeInlineScript(document, script) {
  if (script.getAttribute("src") !== null) return;
  setCurrentScript(document, script);
  setDocumentParserInsertionPoint(document, script);
  try {
    globalThis.eval(script.textContent ?? "");
    dispatchScriptEvent(script, "load");
  } catch (error) {
    dispatchScriptEvent(script, "error", error);
  } finally {
    setDocumentParserInsertionPoint(document, null);
    setCurrentScript(document, null);
  }
}

function dispatchScriptEvent(script, type, error = null) {
  if (!script?.dispatchEvent || typeof globalThis.Event !== "function") return;
  ensureEventTarget(globalThis);
  const event = new globalThis.Event(type);
  if (error !== null) {
    Object.defineProperty(event, "error", { value: error, enumerable: true });
    Object.defineProperty(event, "message", {
      value: `${error.message ?? error}`,
      enumerable: true,
    });
  }
  script.dispatchEvent(event);
}

function appendText(document, parent, text) {
  if (text !== "") {
    parent.appendChild(document.createTextNode(text));
  }
}

function namespaceFor(document, parent, context, name) {
  if (document.contentType !== "text/html") {
    return parent?.namespaceURI ?? context?.namespaceURI ?? null;
  }
  const candidate = parent.localName === undefined ? context : parent;
  if (name === "svg") {
    return SVG_NAMESPACE;
  }
  if (name === "math") {
    return MATHML_NAMESPACE;
  }
  return candidate?.namespaceURI ?? HTML_NAMESPACE;
}

function findTagEnd(input, start) {
  let quote = "";
  for (let index = start; index < input.length; index += 1) {
    const character = input[index];
    if (quote !== "") {
      if (character === quote) {
        quote = "";
      }
    } else if (character === "\"" || character === "'") {
      quote = character;
    } else if (character === ">") {
      return index;
    }
  }
  return -1;
}

function parseAttributes(source, callback) {
  let index = 0;
  while (index < source.length) {
    while (/\s/u.test(source[index] ?? "")) {
      index += 1;
    }
    if (index >= source.length) {
      break;
    }
    const nameStart = index;
    while (index < source.length && !/[\s=]/u.test(source[index])) {
      index += 1;
    }
    const name = source.slice(nameStart, index);
    while (/\s/u.test(source[index] ?? "")) {
      index += 1;
    }
    let value = "";
    if (source[index] === "=") {
      index += 1;
      while (/\s/u.test(source[index] ?? "")) {
        index += 1;
      }
      const quote = source[index];
      if (quote === "\"" || quote === "'") {
        index += 1;
        const end = source.indexOf(quote, index);
        value = source.slice(index, end < 0 ? source.length : end);
        index = end < 0 ? source.length : end + 1;
      } else {
        const valueStart = index;
        while (index < source.length && !/\s/u.test(source[index])) {
          index += 1;
        }
        value = source.slice(valueStart, index);
      }
    }
    if (name !== "") {
      callback(name, value);
    }
  }
}

function decodeEntities(value) {
  return value.replace(
    /&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);?/giu,
    (match, entity) => {
      const normalized = entity.toLowerCase();
      if (normalized.startsWith("#x")) {
        return String.fromCodePoint(Number.parseInt(normalized.slice(2), 16));
      }
      if (normalized.startsWith("#")) {
        return String.fromCodePoint(Number.parseInt(normalized.slice(1), 10));
      }
      return {
        amp: "&",
        lt: "<",
        gt: ">",
        quot: "\"",
        apos: "'",
        nbsp: "\u00a0",
      }[normalized] ?? match;
    },
  );
}

import { createDOMRect } from "../geometry/dom-rect-constructor.js";
import {
  createDetachedHTMLDocument,
  createXMLDocument,
  documentElements,
  requireDocument,
} from "../dom/document-record.js";
import { parseFragment } from "../dom/html-parser.js";
import { serializeNode } from "../dom/html-serializer.js";

import { initializeRange, requireRange } from "../dom/range-state.js";
import { lookupNamespaceURI } from "../dom/xpath-ns-resolver-callback.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";

const state = new WeakMap();

export function DOMParser() {
  requireNew(new.target, "DOMParser");
  state.set(this, { kind: "parser" });
}
export function XMLSerializer() {
  requireNew(new.target, "XMLSerializer");
  state.set(this, { kind: "serializer" });
}
export function XPathEvaluator() {
  requireNew(new.target, "XPathEvaluator");
  state.set(this, { kind: "evaluator" });
}
export function XPathExpression() { illegalConstructor("XPathExpression", new.target); }
export function XPathResult() { illegalConstructor("XPathResult", new.target); }
export function StaticRange(init) {
  requireNew(new.target, "StaticRange");
  if (init === null || typeof init !== "object") {
    throw new TypeError("StaticRange init is required");
  }
  const range = initializeRange(this);
  range.startContainer = init.startContainer;
  range.startOffset = Number(init.startOffset) >>> 0;
  range.endContainer = init.endContainer;
  range.endOffset = Number(init.endOffset) >>> 0;
}
export function CaretPosition() { illegalConstructor("CaretPosition", new.target); }
export function DOMStringList() { illegalConstructor("DOMStringList", new.target); }
export function CountQueuingStrategy(init) {
  requireNew(new.target, "CountQueuingStrategy");
  state.set(this, {
    kind: "countStrategy",
    highWaterMark: normalizeHighWaterMark(init),
    size: countSize,
  });
}
export function ByteLengthQueuingStrategy(init) {
  requireNew(new.target, "ByteLengthQueuingStrategy");
  state.set(this, {
    kind: "byteStrategy",
    highWaterMark: normalizeHighWaterMark(init),
    size: byteSize,
  });
}
export function DOMStringMap() { illegalConstructor("DOMStringMap", new.target); }

const countSize = { size() { return 1; } }.size;
const byteSize = { size(chunk) { return Number(chunk?.byteLength ?? 0); } }.size;
registerNativeFunction(countSize, "size");
registerNativeFunction(byteSize, "size");

const domUtilityConstructors = Object.freeze([
  DOMParser, XMLSerializer, XPathEvaluator, XPathExpression, XPathResult,
  StaticRange, CaretPosition, DOMStringList, CountQueuingStrategy,
  ByteLengthQueuingStrategy, DOMStringMap,
]);
for (const Constructor of domUtilityConstructors) {
  registerNativeFunction(Constructor, Constructor.name);
}

export function createCaretPosition(offsetNode, offset = 0) {
  const value = Object.create(CaretPosition.prototype);
  state.set(value, {
    kind: "caretPosition",
    offsetNode,
    offset: Number(offset) >>> 0,
  });
  return value;
}

export function createDOMStringList(values = []) {
  const value = Object.create(DOMStringList.prototype);
  const normalized = Object.freeze([...new Set([...values].map(String))]);
  state.set(value, { kind: "stringList", values: normalized });
  normalized.forEach((item, index) => {
    Object.defineProperty(value, index, {
      value: item,
      enumerable: true,
      configurable: true,
    });
  });
  return value;
}

export function createXPathExpression(document, expression) {
  requireDocument(document);
  const value = Object.create(XPathExpression.prototype);
  state.set(value, {
    kind: "xpathExpression",
    document,
    expression: `${expression}`,
  });
  return value;
}

export function evaluateXPath(document, expression, contextNode, type = 0) {
  requireDocument(document);
  const nodes = xpathNodes(document, `${expression}`, contextNode ?? document);
  const value = Object.create(XPathResult.prototype);
  state.set(value, {
    kind: "xpathResult",
    resultType: Number(type) || inferXPathType(expression),
    numberValue: Number(nodes.length),
    stringValue: nodes[0]?.textContent ?? "",
    booleanValue: nodes.length > 0,
    singleNodeValue: nodes[0] ?? null,
    invalidIteratorState: false,
    snapshotLength: nodes.length,
    nodes,
    iteratorIndex: 0,
  });
  return value;
}

export function domUtilityProperty(value, name) {
  if (value instanceof StaticRange) return requireRange(value)[name];
  const record = requireRecord(value);
  if (record.kind === "stringList" && name === "length") {
    return record.values.length;
  }
  return record[name];
}

export function domUtilityOperation(value, name, args) {
  const record = requireRecord(value);
  if (record.kind === "parser" && name === "parseFromString") {
    return parseDocument(`${args[0]}`, `${args[1]}`);
  }
  if (record.kind === "serializer" && name === "serializeToString") {
    return serializeNode(args[0]);
  }
  if (record.kind === "evaluator") {
    const document = args[1]?.nodeType === 9 ? args[1] : globalThis.document;
    if (name === "createExpression") {
      return createXPathExpression(globalThis.document, args[0]);
    }
    if (name === "createNSResolver") return lookupNamespaceURI;
    if (name === "evaluate") {
      const context = args[1] ?? globalThis.document;
      return evaluateXPath(
        context.nodeType === 9
          ? context
          : context.ownerDocument ?? globalThis.document,
        args[0],
        context,
        args[3],
      );
    }
    void document;
  }
  if (record.kind === "xpathExpression" && name === "evaluate") {
    const context = args[0] ?? record.document;
    const document = context.nodeType === 9
      ? context
      : context.ownerDocument ?? record.document;
    return evaluateXPath(document, record.expression, context, args[1]);
  }
  if (record.kind === "xpathResult") {
    if (name === "iterateNext") {
      return record.nodes[record.iteratorIndex++] ?? null;
    }
    if (name === "snapshotItem") return record.nodes[Number(args[0]) >>> 0] ?? null;
  }
  if (record.kind === "caretPosition" && name === "getClientRect") {
    return createDOMRect();
  }
  if (record.kind === "stringList") {
    if (name === "contains") return record.values.includes(`${args[0]}`);
    if (name === "item") return record.values[Number(args[0]) >>> 0] ?? null;
  }
  throw new TypeError(`Unsupported DOM utility operation: ${name}`);
}

export function domUtilityIterator(value) {
  return requireRecord(value).values.values();
}

function parseDocument(source, type) {
  if (type === "text/html") {
    const document = createDetachedHTMLDocument("", false);
    document.body.innerHTML = source;
    return document;
  }
  const supported = [
    "text/xml", "application/xml", "application/xhtml+xml", "image/svg+xml",
  ];
  if (!supported.includes(type)) throw new TypeError("Unsupported document MIME type");
  const document = createXMLDocument();
  const fragment = parseFragment(document, source);
  document.append(...fragment.childNodes);
  return document;
}

function xpathNodes(document, expression, contextNode) {
  if (expression === "//*") return documentElements(document);
  const idMatch = expression.match(/^\/\/\*\[@id=['"]([^'"]+)['"]\]$/u);
  if (idMatch !== null) {
    return [document.getElementById(idMatch[1])].filter(Boolean);
  }
  if (expression === "." || expression === "self::node()") return [contextNode];
  const tagMatch = expression.match(/^\/\/([A-Za-z][\w-]*)$/u);
  if (tagMatch !== null) return [...document.getElementsByTagName(tagMatch[1])];
  return [];
}

function inferXPathType(expression) {
  if (`${expression}`.startsWith("count(")) return 1;
  if (`${expression}`.startsWith("string(")) return 2;
  if (`${expression}`.startsWith("boolean(")) return 3;
  return 0;
}

function normalizeHighWaterMark(init) {
  if (init === null || typeof init !== "object") {
    throw new TypeError("Queuing strategy init is required");
  }
  const value = Number(init.highWaterMark);
  if (!Number.isFinite(value) || value < 0) throw new RangeError("Invalid highWaterMark");
  return value;
}

function requireRecord(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

function requireNew(newTarget, name) {
  if (newTarget === undefined) throw new TypeError(`Failed to construct '${name}': use new`);
}

function illegalConstructor(name, newTarget) {
  // 真实 Chromium：`Failed to construct 'Node': Illegal constructor`
  // 不带接口名的裸文案是可检测偏差。
  throw new TypeError(
    newTarget === undefined
      ? "Illegal constructor"
      : `Failed to construct '${name}': Illegal constructor`,
  );
}

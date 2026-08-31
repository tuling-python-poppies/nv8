import {
  compileEventHandlerAttribute,
  isEventHandlerAttributeName,
} from "../event/event-handler-attribute.js";
import {
  attrValue,
  createAttr,
  registerElementAttributeCallback,
  requireAttr,
  setAttrValue,
} from "./attr-state.js";
import {
  createHTMLCollection,
  refreshHTMLCollection,
} from "./html-collection-state.js";
import {
  createNamedNodeMap,
  namedItem,
  namedItemNS,
  removeNamedItemAlgorithm,
  requireNamedNodeMap,
  setNamedItemAlgorithm,
} from "./named-node-map-state.js";
import {
  descendants,
  ELEMENT_NODE,
  initializeNode,
  notifyMutation,
  requireNode,
} from "./node-state.js";

export const HTML_NAMESPACE = "http://www.w3.org/1999/xhtml";
export const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
export const MATHML_NAMESPACE = "http://www.w3.org/1998/Math/MathML";

const elementState = new WeakMap();

export function initializeElement(
  element,
  qualifiedName,
  ownerDocument,
  namespaceURI = HTML_NAMESPACE,
) {
  const parsed = parseQualifiedName(qualifiedName);
  const isHTML = namespaceURI === HTML_NAMESPACE;
  const localName = isHTML ? parsed.localName.toLowerCase() : parsed.localName;
  const tagName = parsed.prefix === null
    ? (isHTML ? localName.toUpperCase() : localName)
    : `${parsed.prefix}:${localName}`;
  initializeNode(element, ELEMENT_NODE, tagName, null, ownerDocument);
  const state = {
    namespaceURI,
    prefix: parsed.prefix,
    localName,
    tagName,
    attributes: null,
    children: null,
    classList: null,
    part: null,
    shadowRoot: null,
    scrollTop: 0,
    scrollLeft: 0,
    handlers: new Map(),
    capturedPointers: new Set(),
    reflectedElements: new Map(),
    activeViewTransition: null,
  };
  elementState.set(element, state);
  state.attributes = createNamedNodeMap(
    element,
    (name, oldAttr, newAttr) => {
      notifyAttributeMutation(
        element,
        name,
        oldAttr === null ? null : attrValue(oldAttr),
        newAttr === null ? null : attrValue(newAttr),
      );
    },
  );
  registerElementAttributeCallback(element, (attr, value, oldValue) => {
    notifyAttributeMutation(element, requireAttr(attr).name, oldValue, value);
  });
  return state;
}

export function requireElement(value) {
  const state = elementState.get(value);
  if (state === undefined) {
    throw new TypeError("Illegal invocation");
  }
  return state;
}

export function attachElementShadow(element, shadowRoot) {
  const state = requireElement(element);
  if (state.shadowRoot !== null) {
    throw new DOMException(
      "Shadow root cannot be created on a host which already hosts a shadow tree.",
      "NotSupportedError",
    );
  }
  state.shadowRoot = shadowRoot;
}

export function elementShadowRoot(element) {
  return requireElement(element).shadowRoot;
}

export function elementChildren(element) {
  const state = requireElement(element);
  if (state.children === null) {
    state.children = createHTMLCollection(
      () => requireNode(element).children.filter(
        child => requireNode(child).nodeType === ELEMENT_NODE,
      ),
    );
  }
  refreshHTMLCollection(state.children);
  return state.children;
}

export function getAttributeValue(element, name) {
  const normalized = normalizeAttributeName(element, name);
  const attr = namedItem(requireElement(element).attributes, normalized);
  return attr === null ? null : attrValue(attr);
}

export function getAttributeValueNS(element, namespace, localName) {
  const attr = namedItemNS(
    requireElement(element).attributes,
    namespace,
    localName,
  );
  return attr === null ? null : attrValue(attr);
}

export function setAttributeValue(element, name, value) {
  const state = requireElement(element);
  const normalized = normalizeAttributeName(element, name);
  validateName(normalized);
  // 事件处理器内容属性会被编译成函数。真实浏览器里
  // `<div onclick="...">` 之后 `typeof div.onclick === 'function'`；
  // 只存字符串会让 `el.onclick` 是 null，处理器静默失效。
  if (isEventHandlerAttributeName(element, normalized)) {
    element[normalized] = compileEventHandlerAttribute(value);
  }
  let attr = namedItem(state.attributes, normalized);
  if (attr === null) {
    attr = createAttr(normalized, requireNode(element).ownerDocument);
    setAttrValue(attr, value);
    setNamedItemAlgorithm(state.attributes, attr);
  } else {
    setAttrValue(attr, value);
  }
}

export function setAttributeValueNS(element, namespace, qualifiedName, value) {
  const state = requireElement(element);
  const parsed = parseQualifiedName(`${qualifiedName}`);
  validateName(`${qualifiedName}`);
  const normalizedNamespace = namespace === null || `${namespace}` === ""
    ? null
    : `${namespace}`;
  let attr = namedItemNS(state.attributes, normalizedNamespace, parsed.localName);
  if (attr === null) {
    attr = createAttr(
      `${qualifiedName}`,
      requireNode(element).ownerDocument,
      normalizedNamespace,
      parsed.prefix,
      parsed.localName,
    );
    setAttrValue(attr, value);
    setNamedItemAlgorithm(state.attributes, attr, true);
  } else {
    setAttrValue(attr, value);
  }
}

export function removeAttributeValue(element, name) {
  const state = requireElement(element);
  const normalized = normalizeAttributeName(element, name);
  if (namedItem(state.attributes, normalized) !== null) {
    removeNamedItemAlgorithm(state.attributes, normalized);
  }
}

export function removeAttributeValueNS(element, namespace, localName) {
  const state = requireElement(element);
  const normalizedNamespace = namespace === null || `${namespace}` === ""
    ? null
    : `${namespace}`;
  if (namedItemNS(state.attributes, normalizedNamespace, `${localName}`) !== null) {
    removeNamedItemAlgorithm(
      state.attributes,
      normalizedNamespace,
      true,
      `${localName}`,
    );
  }
}

export function attributeNames(element) {
  return requireNamedNodeMap(requireElement(element).attributes).attributes.map(
    attr => requireAttr(attr).name,
  );
}

export function attributeNodes(element) {
  return requireNamedNodeMap(requireElement(element).attributes).attributes.slice();
}

export function descendantElements(element) {
  requireElement(element);
  return descendants(element).filter(node => requireNode(node).nodeType === ELEMENT_NODE);
}

export function parseQualifiedName(value) {
  const name = `${value}`;
  const colon = name.indexOf(":");
  return colon < 0
    ? { prefix: null, localName: name }
    : { prefix: name.slice(0, colon), localName: name.slice(colon + 1) };
}

export function validateName(name) {
  if (!/^[A-Za-z_][A-Za-z0-9_.:-]*$/u.test(name)) {
    throw new DOMException(
      `Invalid attribute name: ${name}`,
      "InvalidCharacterError",
    );
  }
}

function normalizeAttributeName(element, name) {
  const normalized = `${name}`;
  return requireElement(element).namespaceURI === HTML_NAMESPACE
    ? normalized.toLowerCase()
    : normalized;
}

function notifyAttributeMutation(element, name, oldValue, value) {
  notifyMutation({
    type: "attributes",
    target: element,
    attributeName: name,
    attributeNamespace: null,
    oldValue,
    value,
  });
}

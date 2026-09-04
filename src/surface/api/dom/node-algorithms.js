import {
  childIndex,
  CDATA_SECTION_NODE,
  COMMENT_NODE,
  descendants,
  DOCUMENT_FRAGMENT_NODE,
  DOCUMENT_NODE,
  DOCUMENT_TYPE_NODE,
  DOCUMENT_POSITION_CONTAINED_BY,
  DOCUMENT_POSITION_CONTAINS,
  DOCUMENT_POSITION_DISCONNECTED,
  DOCUMENT_POSITION_FOLLOWING,
  DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC,
  DOCUMENT_POSITION_PRECEDING,
  ELEMENT_NODE,
  initializeNode,
  insertNode,
  isInclusiveAncestor,
  isNode,
  removeNode,
  replaceNode,
  requireNode,
  rootOf,
  TEXT_NODE,
  textContentOf,
} from "./node-state.js";
import { createCDATASection } from "./cdata-section-constructor.js";
import {
  createProcessingInstruction,
} from "./processing-instruction-constructor.js";
import {
  PROCESSING_INSTRUCTION_NODE,
} from "./node-state.js";
import { createDocumentType } from "./document-type-state.js";
import {
  isTemplate,
  requireTemplate,
} from "./html-template-element-state.js";

export function appendChildAlgorithm(parent, node) {
  if (!isNode(node)) {
    throw new TypeError(
      "Failed to execute 'appendChild' on 'Node': parameter 1 is not of type 'Node'.",
    );
  }
  return insertNode(parent, node, null);
}

export function insertBeforeAlgorithm(parent, node, referenceNode) {
  if (!isNode(node)) {
    throw new TypeError(
      "Failed to execute 'insertBefore' on 'Node': parameter 1 is not of type 'Node'.",
    );
  }
  if (referenceNode !== null && !isNode(referenceNode)) {
    throw new TypeError(
      "Failed to execute 'insertBefore' on 'Node': parameter 2 is not of type 'Node'.",
    );
  }
  return insertNode(parent, node, referenceNode);
}

export function removeChildAlgorithm(parent, child) {
  if (!isNode(child)) {
    throw new TypeError(
      "Failed to execute 'removeChild' on 'Node': parameter 1 is not of type 'Node'.",
    );
  }
  return removeNode(parent, child);
}

export function replaceChildAlgorithm(parent, node, child) {
  if (!isNode(node) || !isNode(child)) {
    throw new TypeError("Failed to execute 'replaceChild' on 'Node': parameter is not of type 'Node'.");
  }
  return replaceNode(parent, node, child);
}

export function hasChildNodesAlgorithm(node) {
  return requireNode(node).children.length !== 0;
}

export function containsAlgorithm(node, other) {
  requireNode(node);
  if (other === null) {
    return false;
  }
  if (!isNode(other)) {
    throw new TypeError(
      "Failed to execute 'contains' on 'Node': parameter 1 is not of type 'Node'.",
    );
  }
  return isInclusiveAncestor(node, other);
}

export function getRootNodeAlgorithm(node, options) {
  requireNode(node);
  const root = rootOf(node);
  if (
    options !== undefined
    && options !== null
    && Boolean(Object(options).composed)
    && requireNode(root).host !== undefined
  ) {
    return rootOf(requireNode(root).host);
  }
  return root;
}

export function isSameNodeAlgorithm(node, other) {
  requireNode(node);
  return node === other;
}

export function isEqualNodeAlgorithm(node, other) {
  requireNode(node);
  if (other === null) {
    return false;
  }
  if (!isNode(other)) {
    return false;
  }
  return equalNode(node, other);
}

function equalNode(left, right) {
  const a = requireNode(left);
  const b = requireNode(right);
  if (
    a.nodeType !== b.nodeType
    || a.nodeName !== b.nodeName
    || a.nodeValue !== b.nodeValue
    || a.children.length !== b.children.length
  ) {
    return false;
  }
  for (let index = 0; index < a.children.length; index += 1) {
    if (!equalNode(a.children[index], b.children[index])) {
      return false;
    }
  }
  return true;
}

export function cloneNodeAlgorithm(node, deep = false) {
  const state = requireNode(node);
  const document = state.nodeType === DOCUMENT_NODE
    ? node
    : state.ownerDocument;
  let clone;
  if (state.nodeType === ELEMENT_NODE && document !== null) {
    clone = document.createElementNS(node.namespaceURI, node.tagName);
    for (const attribute of node.attributes) {
      clone.setAttributeNS(
        attribute.namespaceURI,
        attribute.name,
        attribute.value,
      );
    }
  } else if (state.nodeType === TEXT_NODE && document !== null) {
    clone = document.createTextNode(state.nodeValue ?? "");
  } else if (state.nodeType === CDATA_SECTION_NODE && document !== null) {
    clone = createCDATASection(state.nodeValue ?? "", document);
  } else if (state.nodeType === COMMENT_NODE && document !== null) {
    clone = document.createComment(state.nodeValue ?? "");
  } else if (
    state.nodeType === PROCESSING_INSTRUCTION_NODE
    && document !== null
  ) {
    clone = createProcessingInstruction(
      state.nodeName,
      state.nodeValue ?? "",
      document,
    );
  } else if (state.nodeType === DOCUMENT_FRAGMENT_NODE && document !== null) {
    clone = document.createDocumentFragment();
  } else if (state.nodeType === DOCUMENT_TYPE_NODE && document !== null) {
    clone = createDocumentType(
      node.name,
      document,
      node.publicId,
      node.systemId,
    );
  } else {
    clone = Object.create(Object.getPrototypeOf(node));
    initializeNode(
      clone,
      state.nodeType,
      state.nodeName,
      state.nodeValue,
      state.ownerDocument,
    );
  }
  if (isTemplate(node) && isTemplate(clone)) {
    const sourceTemplate = requireTemplate(node);
    const cloneTemplate = requireTemplate(clone);
    cloneTemplate.shadowRootMode = sourceTemplate.shadowRootMode;
    cloneTemplate.shadowRootDelegatesFocus =
      sourceTemplate.shadowRootDelegatesFocus;
    cloneTemplate.shadowRootClonable = sourceTemplate.shadowRootClonable;
    cloneTemplate.shadowRootSerializable =
      sourceTemplate.shadowRootSerializable;
    cloneTemplate.shadowRootCustomElementRegistry =
      sourceTemplate.shadowRootCustomElementRegistry;
    cloneTemplate.htmlFor = sourceTemplate.htmlFor;
  }
  if (deep) {
    const source = isTemplate(node)
      ? requireNode(requireTemplate(node).content).children
      : state.children;
    const target = isTemplate(clone)
      ? requireTemplate(clone).content
      : clone;
    for (const child of source) {
      insertNode(target, cloneNodeAlgorithm(child, true), null);
    }
  }
  return clone;
}

export function compareDocumentPositionAlgorithm(node, other) {
  requireNode(node);
  if (!isNode(other)) {
    throw new TypeError(
      "Failed to execute 'compareDocumentPosition' on 'Node': parameter 1 is not of type 'Node'.",
    );
  }
  if (node === other) {
    return 0;
  }
  if (rootOf(node) !== rootOf(other)) {
    return DOCUMENT_POSITION_DISCONNECTED
      | DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC
      | DOCUMENT_POSITION_FOLLOWING;
  }
  if (isInclusiveAncestor(node, other)) {
    return DOCUMENT_POSITION_CONTAINED_BY | DOCUMENT_POSITION_FOLLOWING;
  }
  if (isInclusiveAncestor(other, node)) {
    return DOCUMENT_POSITION_CONTAINS | DOCUMENT_POSITION_PRECEDING;
  }
  const ordered = [rootOf(node), ...descendants(rootOf(node))];
  return ordered.indexOf(node) < ordered.indexOf(other)
    ? DOCUMENT_POSITION_FOLLOWING
    : DOCUMENT_POSITION_PRECEDING;
}

export function normalizeAlgorithm(node) {
  const state = requireNode(node);
  let index = 0;
  while (index < state.children.length) {
    const child = state.children[index];
    const childState = requireNode(child);
    if (childState.nodeType === 3) {
      while (
        index + 1 < state.children.length
        && requireNode(state.children[index + 1]).nodeType === 3
      ) {
        const next = state.children[index + 1];
        childState.nodeValue += requireNode(next).nodeValue;
        removeNode(node, next);
      }
      if (childState.nodeValue === "") {
        removeNode(node, child);
        continue;
      }
    } else {
      normalizeAlgorithm(child);
    }
    index += 1;
  }
}

export function lookupNamespaceURIAlgorithm(node, prefix) {
  requireNode(node);
  const normalized = prefix === null ? null : `${prefix}`;
  let current = node;
  while (current !== null) {
    const state = requireNode(current);
    if (state.namespaceURI !== undefined && (state.prefix ?? null) === normalized) {
      return state.namespaceURI;
    }
    current = state.parent;
  }
  return normalized === "xml" ? "http://www.w3.org/XML/1998/namespace" : null;
}

export function lookupPrefixAlgorithm(node, namespace) {
  requireNode(node);
  const normalized = namespace === null ? null : `${namespace}`;
  let current = node;
  while (current !== null) {
    const state = requireNode(current);
    if (state.namespaceURI === normalized && state.prefix) {
      return state.prefix;
    }
    current = state.parent;
  }
  return normalized === "http://www.w3.org/XML/1998/namespace" ? "xml" : null;
}

export function isDefaultNamespaceAlgorithm(node, namespace) {
  return lookupNamespaceURIAlgorithm(node, null) === (
    namespace === null ? null : `${namespace}`
  );
}

export function nodeTextAlgorithm(node) {
  return textContentOf(node);
}

import { installNodeAppendChild } from "../api/dom/node-append-child.js";
import { installNodeBaseURI } from "../api/dom/node-base-uri-getter.js";
import { installNodeChildNodes } from "../api/dom/node-child-nodes-getter.js";
import { installNodeCloneNode } from "../api/dom/node-clone-node.js";
import {
  installNodeCompareDocumentPosition,
} from "../api/dom/node-compare-document-position.js";
import {
  installNodeConstructor,
  installNodeConstructorBacklink,
  installNodePrototypeConstants,
  installNodeToStringTag,
} from "../api/dom/node-constructor.js";
import { installNodeContains } from "../api/dom/node-contains.js";
import { installNodeFirstChild } from "../api/dom/node-first-child-getter.js";
import { installNodeGetRootNode } from "../api/dom/node-get-root-node.js";
import {
  installNodeHasChildNodes,
} from "../api/dom/node-has-child-nodes.js";
import { installNodeInsertBefore } from "../api/dom/node-insert-before.js";
import {
  installNodeIsConnected,
} from "../api/dom/node-is-connected-getter.js";
import {
  installNodeIsDefaultNamespace,
} from "../api/dom/node-is-default-namespace.js";
import { installNodeIsEqualNode } from "../api/dom/node-is-equal-node.js";
import { installNodeIsSameNode } from "../api/dom/node-is-same-node.js";
import { installNodeLastChild } from "../api/dom/node-last-child-getter.js";
import {
  installNodeLookupNamespaceURI,
} from "../api/dom/node-lookup-namespace-uri.js";
import { installNodeLookupPrefix } from "../api/dom/node-lookup-prefix.js";
import { installNodeName } from "../api/dom/node-node-name-getter.js";
import { installNodeType } from "../api/dom/node-node-type-getter.js";
import { installNodeValue } from "../api/dom/node-node-value-property.js";
import {
  installNodeNextSibling,
} from "../api/dom/node-next-sibling-getter.js";
import { installNodeNormalize } from "../api/dom/node-normalize.js";
import {
  installNodeOwnerDocument,
} from "../api/dom/node-owner-document-getter.js";
import {
  installNodeParentElement,
} from "../api/dom/node-parent-element-getter.js";
import {
  installNodeParentNode,
} from "../api/dom/node-parent-node-getter.js";
import {
  installNodePreviousSibling,
} from "../api/dom/node-previous-sibling-getter.js";
import { installNodeRemoveChild } from "../api/dom/node-remove-child.js";
import { installNodeReplaceChild } from "../api/dom/node-replace-child.js";
import { installNodeTextContent } from "../api/dom/node-text-content-property.js";

export function installNode() {
  installNodeConstructor();
  installNodeType();
  installNodeName();
  installNodeBaseURI();
  installNodeIsConnected();
  installNodeOwnerDocument();
  installNodeParentNode();
  installNodeParentElement();
  installNodeChildNodes();
  installNodeFirstChild();
  installNodeLastChild();
  installNodePreviousSibling();
  installNodeNextSibling();
  installNodeValue();
  installNodeTextContent();
  installNodePrototypeConstants();
  installNodeAppendChild();
  installNodeCloneNode();
  installNodeCompareDocumentPosition();
  installNodeContains();
  installNodeGetRootNode();
  installNodeHasChildNodes();
  installNodeInsertBefore();
  installNodeIsDefaultNamespace();
  installNodeIsEqualNode();
  installNodeIsSameNode();
  installNodeLookupNamespaceURI();
  installNodeLookupPrefix();
  installNodeNormalize();
  installNodeRemoveChild();
  installNodeReplaceChild();
  installNodeConstructorBacklink();
  installNodeToStringTag();
}

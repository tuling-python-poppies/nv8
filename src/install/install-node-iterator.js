import {
  definePrototypeGetter,
  definePrototypeMethod,
} from "../webidl/descriptor.js";
import {
  finishNodeIteratorConstructor,
  installNodeIteratorConstructor,
  NodeIterator,
} from "../api/dom/node-iterator-constructor.js";
import { detach } from "../api/dom/node-iterator-detach.js";
import { filter } from "../api/dom/node-iterator-filter-getter.js";
import { nextNode } from "../api/dom/node-iterator-next-node.js";
import {
  pointerBeforeReferenceNode,
} from "../api/dom/node-iterator-pointer-before-reference-node-getter.js";
import {
  previousNode,
} from "../api/dom/node-iterator-previous-node.js";
import {
  referenceNode,
} from "../api/dom/node-iterator-reference-node-getter.js";
import { root } from "../api/dom/node-iterator-root-getter.js";
import {
  whatToShow,
} from "../api/dom/node-iterator-what-to-show-getter.js";

export function installNodeIterator() {
  installNodeIteratorConstructor();
  definePrototypeGetter(NodeIterator.prototype, "root", root);
  definePrototypeGetter(
    NodeIterator.prototype,
    "referenceNode",
    referenceNode,
  );
  definePrototypeGetter(
    NodeIterator.prototype,
    "pointerBeforeReferenceNode",
    pointerBeforeReferenceNode,
  );
  definePrototypeGetter(NodeIterator.prototype, "whatToShow", whatToShow);
  definePrototypeGetter(NodeIterator.prototype, "filter", filter);
  definePrototypeMethod(NodeIterator.prototype, "detach", detach);
  definePrototypeMethod(NodeIterator.prototype, "nextNode", nextNode);
  definePrototypeMethod(NodeIterator.prototype, "previousNode", previousNode);
  finishNodeIteratorConstructor();
}

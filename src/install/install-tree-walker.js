import {
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
} from "../webidl/descriptor.js";
import {
  finishTreeWalkerConstructor,
  installTreeWalkerConstructor,
  TreeWalker,
} from "../api/dom/tree-walker-constructor.js";
import {
  currentNode,
  setCurrentNode,
} from "../api/dom/tree-walker-current-node-property.js";
import { filter } from "../api/dom/tree-walker-filter-getter.js";
import { firstChild } from "../api/dom/tree-walker-first-child.js";
import { lastChild } from "../api/dom/tree-walker-last-child.js";
import { nextNode } from "../api/dom/tree-walker-next-node.js";
import { nextSibling } from "../api/dom/tree-walker-next-sibling.js";
import { parentNode } from "../api/dom/tree-walker-parent-node.js";
import { previousNode } from "../api/dom/tree-walker-previous-node.js";
import {
  previousSibling,
} from "../api/dom/tree-walker-previous-sibling.js";
import { root } from "../api/dom/tree-walker-root-getter.js";
import {
  whatToShow,
} from "../api/dom/tree-walker-what-to-show-getter.js";

export function installTreeWalker() {
  installTreeWalkerConstructor();
  definePrototypeGetter(TreeWalker.prototype, "root", root);
  definePrototypeGetter(TreeWalker.prototype, "whatToShow", whatToShow);
  definePrototypeGetter(TreeWalker.prototype, "filter", filter);
  definePrototypeAccessor(
    TreeWalker.prototype,
    "currentNode",
    currentNode,
    setCurrentNode,
  );
  definePrototypeMethod(TreeWalker.prototype, "firstChild", firstChild);
  definePrototypeMethod(TreeWalker.prototype, "lastChild", lastChild);
  definePrototypeMethod(TreeWalker.prototype, "nextNode", nextNode);
  definePrototypeMethod(TreeWalker.prototype, "nextSibling", nextSibling);
  definePrototypeMethod(TreeWalker.prototype, "parentNode", parentNode);
  definePrototypeMethod(TreeWalker.prototype, "previousNode", previousNode);
  definePrototypeMethod(
    TreeWalker.prototype,
    "previousSibling",
    previousSibling,
  );
  finishTreeWalkerConstructor();
}

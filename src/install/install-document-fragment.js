import {
  finishDocumentFragmentConstructor,
  installDocumentFragmentConstructor,
  DocumentFragment,
} from "../api/dom/document-fragment-constructor.js";
import { definePrototypeGetter, definePrototypeMethod } from "../webidl/descriptor.js";
import { append } from "../api/dom/document-fragment-append.js";
import { childElementCount } from "../api/dom/document-fragment-child-element-count-getter.js";
import { children } from "../api/dom/document-fragment-children-getter.js";
import { firstElementChild } from "../api/dom/document-fragment-first-element-child-getter.js";
import { getElementById } from "../api/dom/document-fragment-get-element-by-id.js";
import { lastElementChild } from "../api/dom/document-fragment-last-element-child-getter.js";
import { moveBefore } from "../api/dom/document-fragment-move-before.js";
import { prepend } from "../api/dom/document-fragment-prepend.js";
import { querySelectorAll } from "../api/dom/document-fragment-query-selector-all.js";
import { querySelector } from "../api/dom/document-fragment-query-selector.js";
import { replaceChildren } from "../api/dom/document-fragment-replace-children.js";

export function installDocumentFragment() {
  installDocumentFragmentConstructor();
  definePrototypeGetter(DocumentFragment.prototype, "children", children);
  definePrototypeGetter(DocumentFragment.prototype, "firstElementChild", firstElementChild);
  definePrototypeGetter(DocumentFragment.prototype, "lastElementChild", lastElementChild);
  definePrototypeGetter(DocumentFragment.prototype, "childElementCount", childElementCount);
  definePrototypeMethod(DocumentFragment.prototype, "append", append);
  definePrototypeMethod(DocumentFragment.prototype, "getElementById", getElementById);
  definePrototypeMethod(DocumentFragment.prototype, "moveBefore", moveBefore);
  definePrototypeMethod(DocumentFragment.prototype, "prepend", prepend);
  definePrototypeMethod(DocumentFragment.prototype, "querySelector", querySelector);
  definePrototypeMethod(DocumentFragment.prototype, "querySelectorAll", querySelectorAll);
  definePrototypeMethod(DocumentFragment.prototype, "replaceChildren", replaceChildren);
  finishDocumentFragmentConstructor();
}

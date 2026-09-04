import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { traceConstruct } from "../../../infra/trace/trace-function.js";
import { currentDocument } from "./document-state.js";
import { Node } from "./node-constructor.js";
import { DOCUMENT_FRAGMENT_NODE, initializeNode } from "./node-state.js";

export function DocumentFragment() {
  if (new.target === undefined) {
    throw new TypeError(
      "Failed to construct 'DocumentFragment': Please use the 'new' operator, this DOM object constructor cannot be called as a function.",
    );
  }
  initializeNode(
    this,
    DOCUMENT_FRAGMENT_NODE,
    "#document-fragment",
    null,
    currentDocument(),
  );
  traceConstruct("window.DocumentFragment", [], "DocumentFragment");
}
registerNativeFunction(DocumentFragment, "DocumentFragment");

export function createDocumentFragment(ownerDocument) {
  const fragment = Object.create(DocumentFragment.prototype);
  initializeNode(
    fragment,
    DOCUMENT_FRAGMENT_NODE,
    "#document-fragment",
    null,
    ownerDocument,
  );
  return fragment;
}

export function installDocumentFragmentConstructor() {
  Object.setPrototypeOf(DocumentFragment.prototype, Node.prototype);
  Object.setPrototypeOf(DocumentFragment, Node);
  delete DocumentFragment.prototype.constructor;
  defineGlobalConstructor("DocumentFragment", DocumentFragment);
}

export function finishDocumentFragmentConstructor() {
  defineConstructorBacklink(DocumentFragment.prototype, DocumentFragment);
  defineToStringTag(DocumentFragment.prototype, "DocumentFragment");
  Object.defineProperty(DocumentFragment.prototype, Symbol.unscopables, {
    value: Object.freeze({
      append: true,
      prepend: true,
      replaceChildren: true,
    }),
    writable: false,
    enumerable: false,
    configurable: true,
  });
}

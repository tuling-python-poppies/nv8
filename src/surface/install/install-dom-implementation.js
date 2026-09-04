import {
  definePrototypeMethod,
} from "../../engine/webidl/descriptor.js";
import {
  DOMImplementation,
  finishDOMImplementationConstructor,
  installDOMImplementationConstructor,
} from "../api/dom/dom-implementation-constructor.js";
import {
  createDocument,
} from "../api/dom/dom-implementation-create-document.js";
import {
  createDocumentTypeCallback,
} from "../api/dom/dom-implementation-create-document-type.js";
import {
  createHTMLDocument,
} from "../api/dom/dom-implementation-create-html-document.js";
import {
  hasFeature,
} from "../api/dom/dom-implementation-has-feature.js";

export function installDOMImplementation() {
  installDOMImplementationConstructor();
  definePrototypeMethod(
    DOMImplementation.prototype,
    "createDocument",
    createDocument,
  );
  definePrototypeMethod(
    DOMImplementation.prototype,
    "createDocumentType",
    createDocumentTypeCallback,
  );
  definePrototypeMethod(
    DOMImplementation.prototype,
    "createHTMLDocument",
    createHTMLDocument,
  );
  definePrototypeMethod(
    DOMImplementation.prototype,
    "hasFeature",
    hasFeature,
  );
  finishDOMImplementationConstructor();
}

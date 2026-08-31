import {
  finishXMLDocumentConstructor,
  installXMLDocumentConstructor,
} from "../api/dom/xml-document-constructor.js";

export function installXMLDocument() {
  installXMLDocumentConstructor();
  finishXMLDocumentConstructor();
}

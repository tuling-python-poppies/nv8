import {
  finishDocumentTypeConstructor,
  installDocumentTypeConstructor,
} from "../api/dom/document-type-constructor.js";
import {
  installDocumentTypeName,
} from "../api/dom/document-type-name-getter.js";
import {
  installDocumentTypePublicId,
} from "../api/dom/document-type-public-id-getter.js";
import {
  installDocumentTypeSystemId,
} from "../api/dom/document-type-system-id-getter.js";
import { definePrototypeMethod } from "../webidl/descriptor.js";
import { DocumentType } from "../api/dom/document-type-constructor.js";
import { after } from "../api/dom/document-type-after.js";
import { before } from "../api/dom/document-type-before.js";
import { remove } from "../api/dom/document-type-remove.js";
import { replaceWith } from "../api/dom/document-type-replace-with.js";

export function installDocumentType() {
  installDocumentTypeConstructor();
  installDocumentTypeName();
  installDocumentTypePublicId();
  installDocumentTypeSystemId();
  definePrototypeMethod(DocumentType.prototype, "after", after);
  definePrototypeMethod(DocumentType.prototype, "before", before);
  definePrototypeMethod(DocumentType.prototype, "remove", remove);
  definePrototypeMethod(DocumentType.prototype, "replaceWith", replaceWith);
  finishDocumentTypeConstructor();
}

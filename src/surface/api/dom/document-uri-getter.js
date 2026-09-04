import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Document } from "./document-constructor.js";
import { requireDocument } from "./document-record.js";

export const documentURI = Object.getOwnPropertyDescriptor({
  get documentURI() {
    const value = requireDocument(this).URL;
    traceGetter("window.Document.prototype.documentURI", "Document", value);
    return value;
  },
}, "documentURI").get;
registerNativeGetter(documentURI, "documentURI");
export function installDocumentURI() {
  definePrototypeGetter(Document.prototype, "documentURI", documentURI);
}

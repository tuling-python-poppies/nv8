import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Document } from "./document-constructor.js";
import { requireDocument } from "./document-record.js";

export const contentType = Object.getOwnPropertyDescriptor({
  get contentType() {
    const value = requireDocument(this).contentType;
    traceGetter("window.Document.prototype.contentType", "Document", value);
    return value;
  },
}, "contentType").get;
registerNativeGetter(contentType, "contentType");
export function installDocumentContentType() {
  definePrototypeGetter(Document.prototype, "contentType", contentType);
}

import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Document } from "./document-constructor.js";
import { documentHead } from "./document-record.js";

export const head = Object.getOwnPropertyDescriptor({
  get head() {
    const value = documentHead(this);
    traceGetter("window.Document.prototype.head", "Document", value);
    return value;
  },
}, "head").get;
registerNativeGetter(head, "head");
export function installDocumentHead() {
  definePrototypeGetter(Document.prototype, "head", head);
}

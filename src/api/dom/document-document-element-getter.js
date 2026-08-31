import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Document } from "./document-constructor.js";
import { documentElementOf } from "./document-record.js";

export const documentElement = Object.getOwnPropertyDescriptor({
  get documentElement() {
    const value = documentElementOf(this);
    traceGetter("window.Document.prototype.documentElement", "Document", value);
    return value;
  },
}, "documentElement").get;
registerNativeGetter(documentElement, "documentElement");
export function installDocumentDocumentElement() {
  definePrototypeGetter(Document.prototype, "documentElement", documentElement);
}

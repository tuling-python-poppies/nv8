import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Document } from "./document-constructor.js";
import { requireDocument } from "./document-record.js";

export const readyState = Object.getOwnPropertyDescriptor({
  get readyState() {
    const value = requireDocument(this).readyState;
    traceGetter("window.Document.prototype.readyState", "Document", value);
    return value;
  },
}, "readyState").get;
registerNativeGetter(readyState, "readyState");
export function installDocumentReadyState() {
  definePrototypeGetter(Document.prototype, "readyState", readyState);
}

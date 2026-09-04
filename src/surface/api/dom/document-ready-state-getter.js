import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
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

import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Document } from "./document-constructor.js";
import { requireDocument } from "./document-record.js";
import { requireNode } from "./node-state.js";

export const doctype = Object.getOwnPropertyDescriptor({
  get doctype() {
    requireDocument(this);
    const value = requireNode(this).children.find(
      child => requireNode(child).nodeType === 10,
    ) ?? null;
    traceGetter("window.Document.prototype.doctype", "Document", value);
    return value;
  },
}, "doctype").get;
registerNativeGetter(doctype, "doctype");
export function installDocumentDoctype() {
  definePrototypeGetter(Document.prototype, "doctype", doctype);
}

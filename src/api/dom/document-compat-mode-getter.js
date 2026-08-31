import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Document } from "./document-constructor.js";
import { requireDocument } from "./document-record.js";

export const compatMode = Object.getOwnPropertyDescriptor({
  get compatMode() {
    const value = requireDocument(this).compatMode;
    traceGetter("window.Document.prototype.compatMode", "Document", value);
    return value;
  },
}, "compatMode").get;
registerNativeGetter(compatMode, "compatMode");
export function installDocumentCompatMode() {
  definePrototypeGetter(Document.prototype, "compatMode", compatMode);
}

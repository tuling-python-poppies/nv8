import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Document } from "./document-constructor.js";
import { requireDocument } from "./document-record.js";

export const URL = Object.getOwnPropertyDescriptor({
  get URL() {
    const value = requireDocument(this).URL;
    traceGetter("window.Document.prototype.URL", "Document", value);
    return value;
  },
}, "URL").get;
registerNativeGetter(URL, "URL");
export function installDocumentURL() {
  definePrototypeGetter(Document.prototype, "URL", URL);
}

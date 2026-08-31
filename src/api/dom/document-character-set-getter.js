import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Document } from "./document-constructor.js";
import { requireDocument } from "./document-record.js";

export const characterSet = Object.getOwnPropertyDescriptor({
  get characterSet() {
    const value = requireDocument(this).characterSet;
    traceGetter("window.Document.prototype.characterSet", "Document", value);
    return value;
  },
}, "characterSet").get;
registerNativeGetter(characterSet, "characterSet");
export function installDocumentCharacterSet() {
  definePrototypeGetter(Document.prototype, "characterSet", characterSet);
}

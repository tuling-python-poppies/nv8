import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { DocumentType } from "./document-type-constructor.js";
import { requireDocumentType } from "./document-type-state.js";

export const name = Object.getOwnPropertyDescriptor({
  get name() {
    const value = requireDocumentType(this).name;
    traceGetter("window.DocumentType.prototype.name", "DocumentType", value);
    return value;
  },
}, "name").get;
registerNativeGetter(name, "name");
export function installDocumentTypeName() {
  definePrototypeGetter(DocumentType.prototype, "name", name);
}

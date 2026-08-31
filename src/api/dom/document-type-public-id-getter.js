import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { DocumentType } from "./document-type-constructor.js";
import { requireDocumentType } from "./document-type-state.js";

export const publicId = Object.getOwnPropertyDescriptor({
  get publicId() {
    const value = requireDocumentType(this).publicId;
    traceGetter("window.DocumentType.prototype.publicId", "DocumentType", value);
    return value;
  },
}, "publicId").get;
registerNativeGetter(publicId, "publicId");
export function installDocumentTypePublicId() {
  definePrototypeGetter(DocumentType.prototype, "publicId", publicId);
}

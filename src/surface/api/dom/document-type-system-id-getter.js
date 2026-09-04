import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { DocumentType } from "./document-type-constructor.js";
import { requireDocumentType } from "./document-type-state.js";

export const systemId = Object.getOwnPropertyDescriptor({
  get systemId() {
    const value = requireDocumentType(this).systemId;
    traceGetter("window.DocumentType.prototype.systemId", "DocumentType", value);
    return value;
  },
}, "systemId").get;
registerNativeGetter(systemId, "systemId");
export function installDocumentTypeSystemId() {
  definePrototypeGetter(DocumentType.prototype, "systemId", systemId);
}

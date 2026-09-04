import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { createAttr } from "./attr-state.js";
import { Document } from "./document-constructor.js";
import { requireDocument } from "./document-record.js";
import { validateName } from "./element-state.js";

export const createAttribute = {
  createAttribute(localName) {
    requireDocument(this);
    const name = `${localName}`.toLowerCase();
    validateName(name);
    const result = createAttr(name, this);
    traceCall("window.Document.prototype.createAttribute", "Document", [localName], result);
    return result;
  },
}.createAttribute;
registerNativeFunction(createAttribute, "createAttribute");
export function installDocumentCreateAttribute() {
  definePrototypeMethod(Document.prototype, "createAttribute", createAttribute);
}

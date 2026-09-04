import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { Document } from "./document-constructor.js";
import { requireDocument } from "./document-record.js";
import { createRange } from "./range-constructor.js";

export const createRangeCallback = {
  createRange() {
    requireDocument(this);
    const result = createRange(this);
    traceCall("window.Document.prototype.createRange", "Document", [], result);
    return result;
  },
}.createRange;
registerNativeFunction(createRangeCallback, "createRange");
export function installDocumentCreateRange() {
  definePrototypeMethod(Document.prototype, "createRange", createRangeCallback);
}

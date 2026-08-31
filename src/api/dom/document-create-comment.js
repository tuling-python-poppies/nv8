import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { createComment } from "./comment-constructor.js";
import { Document } from "./document-constructor.js";
import { requireDocument } from "./document-record.js";

export const createCommentCallback = {
  createComment(data) {
    requireDocument(this);
    const result = createComment(`${data}`, this);
    traceCall("window.Document.prototype.createComment", "Document", [data], result);
    return result;
  },
}.createComment;
registerNativeFunction(createCommentCallback, "createComment");
export function installDocumentCreateComment() {
  definePrototypeMethod(Document.prototype, "createComment", createCommentCallback);
}

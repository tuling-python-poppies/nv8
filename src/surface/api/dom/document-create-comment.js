import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { createComment } from "./comment-constructor.js";
import { Document } from "./document-constructor.js";
import { requireDocument } from "./document-record.js";

const createCommentCallback = {
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

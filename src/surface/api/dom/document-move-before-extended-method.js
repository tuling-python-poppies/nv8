import { documentMethod } from "./document-method.js";
import { moveBeforeDocumentOperation } from "./document-extended-method-operations.js";
export const moveBefore = documentMethod("moveBefore", 2, moveBeforeDocumentOperation);

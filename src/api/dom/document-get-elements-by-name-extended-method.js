import { documentMethod } from "./document-method.js";
import { getElementsByNameOperation } from "./document-extended-method-operations.js";
export const getElementsByName = documentMethod("getElementsByName", 1, getElementsByNameOperation);

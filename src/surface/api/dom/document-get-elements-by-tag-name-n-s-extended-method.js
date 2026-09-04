import { documentMethod } from "./document-method.js";
import { getElementsByTagNameNSOperation } from "./document-extended-method-operations.js";
export const getElementsByTagNameNS = documentMethod("getElementsByTagNameNS", 2, getElementsByTagNameNSOperation);

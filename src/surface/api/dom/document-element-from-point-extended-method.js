import { documentMethod } from "./document-method.js";
import { elementFromPointOperation } from "./document-extended-method-operations.js";
export const elementFromPoint = documentMethod("elementFromPoint", 2, elementFromPointOperation);

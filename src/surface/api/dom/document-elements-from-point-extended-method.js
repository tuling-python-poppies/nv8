import { documentMethod } from "./document-method.js";
import { elementsFromPointOperation } from "./document-extended-method-operations.js";
export const elementsFromPoint = documentMethod("elementsFromPoint", 2, elementsFromPointOperation);
